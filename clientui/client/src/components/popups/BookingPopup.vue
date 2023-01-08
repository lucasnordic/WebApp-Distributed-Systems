<!--
Booking POPUP; Deals with selecting time and date;
Author(s): Lucas, Ediz, Adam
-->
<template>
  <div>
    <b-modal
      id="modal-booking"
      centered
      title="Your Booking"
      hide-footer
      hide-header
      size="md"
    >
      <!-- Choose a date -->
      <div id="date-wrapper">
        <label for="date-schedule">Choose a date</label>
        <b-form-datepicker
          id="date-schedule"
          v-model="selectedDate"
          locale="en-US"
          :min="minDate"
          :max="maxDate"
          :date-disabled-fn="dateDisabled"
          class="mb-2"
          placeholder="Select a date"
          @context="onContext"
        ></b-form-datepicker>
      </div>

      <div v-if="selectedADate === true">
        <!-- Choose a Tab/Person -->
        <b-container class="groupTabs">
          <b-card class="availableSlots" no-body>
            <b-tabs v-model="bookingPerson" card title-item-class="test">
              <b-tab
                v-for="i in tabs"
                :key="'dyn-tab-' + i"
                :title="'Person ' + (i + 1)"
                @click="bookingPerson = i"
                v-bind:style="style('selected' + i)"
              >
              </b-tab>

              <!-- NEW TAB BUTTON -->
              <template #tabs-end>
                <b-nav-item
                  :disabled="tabCounter >= 4"
                  role="presentation"
                  @click.prevent="newTab"
                  href="#"
                  ><b>+</b></b-nav-item
                >
              </template>

              <!-- DELETE TAB BUTTON -->
              <template #tabs-start>
                <b-nav-item
                  :disabled="tabCounter <= 1"
                  role="presentation"
                  @click="closeTab(tabs[tabs.length - 1])"
                  href="#"
                  ><b>-</b></b-nav-item
                >
              </template>
            </b-tabs>
          </b-card>
        </b-container>

        <!-- Choose a time -->
        <b-container class="booking-times">
          <label for="booking-times" id="booking-times-label"
            >Choose a time
            <p>= Available dentists</p>
            <img src="@/assets/images/1_person_icon.svg"
          /></label>

          <b-row
            align-h="center"
            v-for="times in groupedTimes"
            v-bind:key="times.id"
          >
            <b-col
              id="booking-time-column"
              class="pointer"
              cols="4"
              selectable
              v-for="time in times"
              v-bind:key="time.id"
              v-bind:style="style(time.available)"
              @click="onSelectTime(time)"
            >
              <div>
                <div style="display: inline">
                  {{ time.time }}
                </div>
                <!-- TODO: Remake this horrible v-if -->
                <div
                  v-if="
                    time.available === 'available' ||
                    time.available === 'selected0' ||
                    time.available === 'selected1' ||
                    time.available === 'selected2' ||
                    (time.available === 'selected3' &&
                      time.availableDentists > 0)
                  "
                  id="available-dentists-wrapper"
                >
                  |
                  <img
                    v-if="time.availableDentists === 1"
                    src="@/assets/images/1_person_icon.svg"
                  />
                  <img
                    v-if="time.availableDentists === 2"
                    src="@/assets/images/2_person_icon.svg"
                  />
                  <img
                    v-if="time.availableDentists > 2"
                    src="@/assets/images/3_person_icon.svg"
                  />
                  <p style="margin: 0px; display: inline">
                    {{ time.availableDentists }}
                  </p>
                </div>
              </div>
            </b-col>
          </b-row>

          <!-- LINE-BREAK -->
          <hr />

          <!-- BUTTON(s) -->
          <b-row>
            <b-button
              id="confirm-button"
              block
              size="sm"
              variant="success"
              :disabled="
                canConfirm(
                  this.$store.state.bookingForm.selectedDate,
                  this.$store.state.bookingForm.selectedTime
                )
              "
              @click="
                $bvModal.hide('modal-booking')
                resetResponse()
                requestIdCounter()
              "
              v-b-modal.modal-confirm
              >Confirm</b-button
            ></b-row
          >
        </b-container>
      </div>
    </b-modal>
  </div>
</template>

<script>
import toast from '@/mixins/toast'

export default {
  name: 'bookingPopup',
  data() {
    // set minDate and maxDate, for when selecting time-slots
    const date = new Date()
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const minDate = new Date(today)
    const maxDate = new Date(today)
    minDate.setDate(minDate.getDate() + 1)
    maxDate.setDate(maxDate.getDate() + 56)
    this.count = 0
    return {
      minDate: minDate,
      maxDate: maxDate,
      times: [], // Times to display for selected day
      selectedADate: false,
      formattedDate: '',
      bookingPerson: 0,
      tabs: [],
      tabCounter: 0,
      recievedMessage: false // if we recieved availabilities
    }
  },
  mixins: [toast],
  methods: {
    // Save the selected date in "Monday, November 30, 2021" Format
    // Used in MQTT availability requests
    onContext(ctx) {
      // 1. Formats date "2021-11-30" into "Monday, November 30, 2021"
      this.formattedDate = ctx.selectedFormatted

      // 2. subscribe and publish when setting a date
      if (this.formattedDate !== 'No date selected') {
        // instantly subscribes and publishes to time-slot availability
        this.pubToAvailability()
        this.subToAvailability()
        // this.$store.commit('updateTimeSlots', 'null') // For debugging
      }

      // 3. Store the selected day? TODO: Remove since not used
      const day = this.formattedDate
        .substring(0, this.formattedDate.indexOf(','))
        .toLowerCase()
      this.$store.commit('updateSelectedDay', day)
    },
    subToAvailability() {
      // 1. set topic
      const topic =
        'availabilityChecker/availablities/' +
        this.$store.state.bookingForm.userId

      // 2. subscribe
      this.$mqtt.subscribe(topic, (err, granted) => {
        if (err) {
          console.log(err)
        }
      })

      // 3. start timer
      this.startTimeout()

      console.log('MQTT: subscribed to ' + topic)
    },
    pubToAvailability() {
      // 1. set message to publish
      const requestMessage = {
        selectedClinic: this.$store.state.selectedClinic.id,
        selectedDate: this.formattedDate,
        userId: this.$store.state.bookingForm.userId
      }
      const stringMessage = JSON.stringify(requestMessage)

      // 3. publish
      this.$mqtt.publish('client/appointmentTrigger', stringMessage)
      console.log(
        'MQTT: published ' +
          stringMessage +
          ' to ' +
          'client/appointmentTrigger'
      )
    },
    requestIdCounter() {
      // Method that creates a counter for requestId
      this.count++
      this.$store.commit('updateBookingForm', {
        whatToUpdate: 'requestId',
        value: this.count
      })
    },
    resetResponse() {
      this.$store.commit('updateRecievedResponse', false) // Booking responses are reset
    },
    // Below method changes a time "column" between selected and available
    onSelectTime(timeSlot) {
      const timesArray = this.$store.state.bookingForm.selectedTime

      // TODO: remove logs?
      console.log('----------------------------')
      console.log(
        'Previous time: ' +
          this.$store.state.bookingForm.selectedTime[this.bookingPerson]
      )
      console.log('New time: ' + timeSlot.time)

      // 1. Check if timeslot is available for selection
      if (timeSlot.available === 'available') {
        // 2. Make the last selected timeslot available
        for (let i = 0; i < this.times.length; i++) {
          if (this.times[i].available === 'selected' + this.bookingPerson) {
            this.times[i].available = 'available'
          }
        }

        // 3. Set the new selected timeslot as ex: 'selected0'
        timesArray[this.bookingPerson] = timeSlot.time
        timeSlot.available = 'selected' + this.bookingPerson

        // 4. If timeslot was already selected, unselect it, and make the array empty
      } else if (timeSlot.available === 'selected' + this.bookingPerson) {
        timeSlot.available = 'available'
        timesArray[this.bookingPerson] = ''
      }

      // 5. update the selected time in the booking form
      this.$store.commit('updateSelectedTime', timesArray)

      // TODO: Log array of times selected
      console.log('array:' + timesArray)
    },
    // Below method changes the styling for a time-slot
    style: (key) => {
      switch (key) {
        case 'unavailable':
          return {
            backgroundColor: '#fefdfd',
            border: '0px',
            color: '#e4e3e3'
          }
        case 'selected0':
          return {
            backgroundColor: '#46B947'
          }
        case 'selected1':
          return {
            backgroundColor: '#94C973'
          }
        case 'selected2':
          return {
            backgroundColor: '#B1D8B7'
          }
        case 'selected3':
          return {
            backgroundColor: '#91B622'
          }
        case 'available':
          return {
            backgroundColor: '#dbe7ed'
          }
      }
    },
    // Template from: https://bootstrap-vue.org/docs/components/form-datepicker
    // Disable weekends (Sunday = `0`, Saturday = `6`)
    dateDisabled(ymd, date) {
      const weekday = date.getDay()
      // Return `true` if the date should be disabled
      return weekday === 0 || weekday === 6
    },
    // Do code inside subscribe when the data has changed
    subscribeToStoreChanges() {
      // Subscribe to "updateTimeSlots" mutations; i.e: timeSlot changes
      this.$store.subscribe((mutation, updateTimeSlots) => {
        if (mutation.type.startsWith('updateTimeSlots')) {
          // update time-slots
          this.times = this.$store.state.timeSlots
        }
      })
      // Subscribe to "updateSelectedDate" mutations to know if user has selected a date
      this.$store.subscribe((mutation, updateSelectedDate) => {
        if (mutation.type.startsWith('updateSelectedDate')) {
          const selectedDateArrayLength =
            this.$store.state.bookingForm.selectedDate.length
          if (selectedDateArrayLength > 0) {
            this.selectedADate = true
          } else {
            this.selectedADate = false
          }
        }
      })
    },
    // Close a tab
    closeTab(x) {
      const timesArray = this.$store.state.bookingForm.selectedTime

      // 1. Clear the time-slot for the person related to the closed tab
      const selectedPerson = this.tabCounter - 1
      for (let l = 0; l < this.times.length; l++) {
        if (this.times[l].available === 'selected' + selectedPerson) {
          this.times[l].available = 'available'
          timesArray[selectedPerson] = ''
          console.log(timesArray)
        }
      }

      // 2. Clear the tab
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i] === x) {
          this.tabCounter--
          this.tabs.splice(i, 1)
        }
      }

      // 3. update the selected times in the booking form
      this.$store.commit('updateSelectedTime', timesArray)
    },
    newTab() {
      this.tabs.push(this.tabCounter++)
    },
    // Used for "Confirm" button;
    // Returns true if Date has been selected &&
    // times for people in booking has been selected
    canConfirm(selectedDate, selectedTime) {
      console.log(selectedDate + ':' + selectedTime + ':' + this.tabCounter)
      let disabled = true
      const filteredTimes = selectedTime.filter((item) => item)

      try {
        // 1. check whether a date has been selected
        if (selectedDate.length <= 1) {
          // TODO: Log error if user has not selected date
          disabled = true
        } else {
          disabled = false
        }

        // 2. check whether timeslots have been selected
        let counter = 0
        for (let i = 0; i < filteredTimes.length; i++) {
          const n = filteredTimes[i]
          if (n !== '') {
            counter++
          }
        }
        if (counter < this.tabCounter) {
          // TODO: Log error if user has not selected times for persons
          disabled = true
        } else {
          disabled = false
        }
      } catch (error) {
        console.log('ERROR:' + error)
      }

      return disabled
    },
    // waits for 'milliseconds' until it checks if clinics are recieved
    startTimeout() {
      const milliseconds = 5000
      setTimeout(() => {
        return this.checkMessageRecieved() // return this method after 'milliseconds' time
      }, milliseconds)
    },
    checkMessageRecieved() {
      console.log(
        'MQTT: Availabilities Recieved = ' +
          this.$store.state.recievedAvailabilites
      )
      if (this.$store.state.recievedAvailabilites === false) {
        this.createToast(
          'Availabilities not recieved. Trying to re-connect!',
          'MQTT',
          'danger'
        )
        this.pubToAvailability() // publish a request for clinics again
        this.startTimeout() // start the timer again
      }
    }
  },

  computed: {
    // Below method slices this.times array so we can make evenly distributed columns in the UI
    groupedTimes() {
      let slicedArrays = []
      const columns = 4
      const times = this.times
      // Slice the array
      slicedArrays = Array.from(
        { length: Math.ceil(times.length / columns) },
        (v, i) => times.slice(i * columns, i * columns + columns)
      )
      return slicedArrays
    },
    // This helps in setting and getting the selectedDate
    selectedDate: {
      get() {
        return this.$store.state.bookingForm.selectedDate[0]
      },
      set(value) {
        const getDate = this.$store.state.bookingForm.selectedDate
        getDate[0] = value
        this.$store.commit('updateSelectedDate', getDate)
        this.$store.commit('updateRecievedAvailabilities', false) // availabilities are reset
      }
    }
  },

  mounted() {
    // subscribe to store/state changes
    this.subscribeToStoreChanges()
    this.newTab() // create a tab for Person 1
  }
}
</script>

<style scoped>
#date-wrapper {
  padding-left: 20px;
  padding-right: 25%;
  padding-bottom: 10px;
  padding-top: 10px;
  background-color: rgb(33, 33, 34);
  color: white;
}

.booking-times {
  border: 0px solid rgb(43, 43, 43);
  padding-top: 25px;
  padding-bottom: 15px;
  font-size: 90%;
}

#booking-times-label {
  width: 100%;
}
#booking-times-label p {
  display: inline;
  float: right;
  opacity: 0.45;
}
#booking-times-label img {
  width: 5%;
  border-radius: 50%;
  padding: 1px;
  float: right;
  opacity: 0.45;
}

#available-dentists-wrapper {
  display: inline;
  opacity: 0.45;
  font-size: 75%;
}
#available-dentists-wrapper img {
  margin-top: 2px;
  width: 25%;
  border-radius: 50%;
}

.groupTabs {
  border: 0ex;
  padding: 0px;
}
.tab-content {
  border: 2ex;
  padding-top: 4px;
  padding-bottom: 4px;
}
.card-body {
  padding: 5px;
}
.nav {
  padding-left: 0;
}
#booking-time-column {
  border-radius: 5px;
  padding-top: 4px;
  padding-bottom: 4px;
  margin: 4px;
  max-width: 112px;
  text-align: center;
}
#booking-time-column:hover {
  background-color: rgb(169, 191, 201);
}

#confirm-button {
  width: 30%;
  position: relative;
  left: 35%;
  /* margin: 5px; */
}
.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 0rem;
}
</style>
