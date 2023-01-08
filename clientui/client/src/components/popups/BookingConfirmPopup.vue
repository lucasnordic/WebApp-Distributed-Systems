<!--
Booking Confirmation POP-UP;
Author(s): Lucas, Adam
-->
<template>
  <div>
    <b-modal id="modal-confirm" centered hide-footer hide-header size="md">
      <div id="selectedclinic-card-bg">
        <div id="selectedclinic-card">
          <b-card
            img-alt="Image"
            img-top
            :title="'Your Appointment'"
            tag="article"
            style="max-width: 20rem"
            class="mb-2"
            v-if="this.$store.state.selectedClinic !== null"
          >
            <!-- <hr /> -->
            <table>
              <!-- <tr>
                <th text-align: center>Booking Information</th>
              </tr> -->
              <tr class="tr-row">
                <td>
                  <b-card-text style="margin: 0"> Clinic: </b-card-text>
                </td>
                <td class="td-info">
                  {{ this.$store.state.selectedClinic.name }}
                </td>
              </tr>
              <tr class="tr-row">
                <td>
                  <b-card-text style="margin: 0"> ID: </b-card-text>
                </td>
                <td class="td-info">{{ bookingForm.userId }}</td>
              </tr>
              <tr class="tr-row">
                <td>
                  <b-card-text style="margin: 0"> Date: </b-card-text>
                </td>
                <td class="td-info">{{ bookingForm.selectedDate[0] }}</td>
              </tr>
              <tr class="tr-row">
                <td>
                  <b-card-text v-if="bookingForm.selectedTime !== ''">
                    Time(s):
                  </b-card-text>
                </td>
                <td>
                  <div
                    class="td-info"
                    v-for="(n, index) in bookingForm.selectedTime"
                    :key="n"
                  >
                    <p v-if="n !== ''" style="margin: 0px">
                      Person {{ index + 1 }}: {{ n }}
                    </p>
                  </div>
                </td>
              </tr>
              <!-- <tr>
                <td>
                  <b-card-text style="margin: 0"> Booking for: </b-card-text>
                </td>
                <td>{{ bookingForm.selectedTime.length }} People</td>
              </tr> -->
              <tr class="tr-row">
                <td>
                  <b-card-text style="margin: 0"> Location: </b-card-text>
                </td>
                <td class="td-info">
                  {{ this.$store.state.selectedClinic.address }}
                </td>
              </tr>
            </table>

            <hr />

            <!-- CONFIRM BOOKING: -->
            <div id="booking-button" class="shadow-lg p-0 bg-black rounded">
              <b-button
                block
                variant="success"
                size="sm"
                @click="$bvModal.hide('modal-confirm'); subAndPubToBooking(); pubToBooking(); startTimeoutResponse();"
                >Book</b-button
              >
            </div>
          </b-card>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script scoped>
import { mapState } from 'vuex'
import toast from '@/mixins/toast'

export default {
  name: 'bookingConfirmPopup',
  computed: {
    ...mapState(['bookingForm'])
  },
  data() {
    return {
    }
  },
  mixins: [toast],
  methods: {
    subAndPubToBooking() {
      // Used when user clicks on "book"
      // 1. set topic and message to publish
      const topic =
        'bookingmanager/booking/userId/' +
        this.$store.state.bookingForm.userId

      // 2. subscribe
      this.$mqtt.subscribe(topic, (err, granted) => {
        if (err) {
          console.log(err)
        }
      })

      console.log('MQTT: subscribed to ' + topic)
    },
    pubToBooking() {
      // Used when user clicks on "book"
      const { v4: uuidv4 } = require('uuid')
      // 3. publish
      const requestMessage = {
        dentistID: this.$store.state.bookingForm.dentistId,
        userId: this.$store.state.bookingForm.userId,
        issuance: uuidv4(),
        selectedDate: this.$store.state.bookingForm.selectedDate,
        selectedTime: this.$store.state.bookingForm.selectedTime,
        requestId: this.$store.state.bookingForm.requestId
      }
      const stringMessage = JSON.stringify(requestMessage)
      this.$mqtt.publish('client/bookingrequest', stringMessage)
      console.log(
        'MQTT: published ' +
          stringMessage +
          ' to ' +
          'client/bookingrequest'
      )
    },
    // waits for 'milliseconds' until it checks if response are recieved
    startTimeoutResponse() {
      const milliseconds = 5000
      setTimeout(() => {
        return this.checkResponseRecieved() // return this method after 'milliseconds' time
      }, milliseconds)
    },
    checkResponseRecieved() {
      console.log('MQTT: Response Recieved = ' + this.$store.state.recievedResponse)
      if (this.$store.state.recievedResponse === false) {
        this.createToast(
          'Response not recieved. Trying to re-connect!',
          'MQTT',
          'danger'
        )
        this.pubToBooking() // publish a request for response again
        this.startTimeoutResponse() // start the timer again
      }
    }
  }
}
</script>

<style>
th,
td {
  padding-left: 15px;
}

#selectedclinic-card-bg {
  background-color: white;
  /* padding-top: 15px; */
  bottom: 0;
  position: sticky;
}

#selectedclinic-card {
  /* padding-bottom: 5px; */
  /* padding-left: 25px;
  padding-right: 25px; */
  position: sticky;
  right: 33px;
  width: 100%;
  border-top: 6px solid rgba(72, 167, 96, 0.9);
}

#selectedclinic-card .card {
  max-width: 100% !important;
  /* background-color: rgba(229, 255, 235, 0.25); */
}

#booking-button {
  /* padding-bottom: 15px; */
  padding-left: 25px;
  padding-right: 25px;
}

/** For table */
.tr-row td {
  border: 2px solid rgba(205, 207, 205, 0.5);
  border-radius: 5px;
  padding: 5px;
  margin: 0;
  vertical-align: baseline;
}
.td-info {
  width: 100%;
}

/** SCALING, RESPONSIVENESS */
@media (max-width: 991px) {
  #selectedclinic-card-bg {
    background-color: rgb(255, 255, 255, 0.8);
    /* padding-top: 15px; */
    bottom: 0;
    position: inherit;
    right: 0;
    left: 0;
    padding: 0%;
  }
}
</style>
