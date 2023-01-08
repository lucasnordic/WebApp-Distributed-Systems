<!--
This vue contains: the header, router-views, the footer, mqtt code
Author(s): Maryam, Hannah, Lucas, Adam
-->

<template>
  <div id="app">
    <!-- HEADER -->
    <b-container id="header" fluid>
      <b-row>
        <b-col>
          <img src="@/assets/images/logo.png" id="logo" />
        </b-col>
        <b-col>
          <!-- APPOINTMENT POPUP -->
          <appointment-popup v-if="this.$route.name === 'patient'" />
        </b-col>
      </b-row>
    </b-container>

    <!-- Render the content of the current page view -->
    <div id="router_wrapper">
      <router-view />
    </div>

    <!-- FOOTER -->
    <b-container id="footer" fluid>
      <b-row>
        <b-col id="disclaimer">
          © 1991-2021 License, Legal Line, a Federal Not-for-profit Corporation.
          All rights reserved.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a class="footer_link" href="https://google.com" target="_blank"
            >FAQ</a
          >
          &nbsp;&nbsp;&nbsp;&nbsp;
          <a class="footer_link" href="https://google.com" target="_blank"
            >About Us</a
          >
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import AppointmentPopup from './components/popups/AppointmentPopup.vue'
import Vue from 'vue'
import toast from './mixins/toast'

export default Vue.extend({
  components: {
    AppointmentPopup
  },
  mixins: [toast],
  data() {
    return {
      timesRecievingAvailabilities: 0,
      timesRecievingClinics: 0,
      recievedResponse: false,
      recievedClinics: false
    }
  },
  created() {
    this.onMqttConnect()
    this.subscribeToClinicsResponse()
    this.publishClinicsRequest()
    this.onMqttMessage() // What happens when messages are recieved through MQTT
  },
  methods: {
    onMqttConnect() {
      this.$mqtt.on('connect', () => {
        console.log('MQTT: Connection succeeded!')
      })
    },
    onMqttMessage() {
      this.$mqtt.on('message', (topic, message) => {
        if (topic.match('client/connected')) {
          console.log(String.fromCharCode.apply(null, message))
          /**
           * For recieving clinics from Clinic Manager:
           */
        } else if (topic.match('clinicmanager/clinics')) {
          this.storeClinics(message)
          this.timesRecievingClinics++
          this.recievedClinics = true
          this.createToast(
            'Clinics Recieved ' + this.timesRecievingClinics + ' times',
            'MQTT',
            'success',
            true
          )
          /**
           * For recieving availabilities from Availability Checker:
           */
        } else if (
          topic.match(
            'availabilityChecker/availablities/' +
              this.$store.state.bookingForm.userId
          )
        ) {
          const parsedMessage = JSON.parse(
            String.fromCharCode.apply(null, message)
          )
          const value = {
            availabilities: parsedMessage
          }
          this.$store.commit('updateTimeSlots', value)
          this.$store.commit('updateRecievedAvailabilities', true)
          this.createToast('Availabilities Recieved!', 'MQTT', 'success', true)
          this.timesRecievingAvailabilities++
          /**
           * For recieving booking responses from Booking Manager:
           */
        } else if (
          topic.match(
            'bookingmanager/booking/userId/' +
              this.$store.state.bookingForm.userId
          )
        ) {
          const parsedMessage = JSON.parse(
            String.fromCharCode.apply(null, message)
          )
          console.log(parsedMessage)
          // Create toast pop up to confirm booking success
          if (!message.includes('err')) {
            this.createToast(
              'Your appointment is set for ' +
                JSON.stringify(this.$store.state.bookingForm.selectedTime)
                  .replace(/[,]/g, ', ')
                  .replace(/["]/g, '')
                  .replace(/[\\[\]']+/g, '') +
                ' on ' +
                this.$store.state.bookingForm.selectedDate,
              'Appointment successfully Booked!',
              'success'
            )
            console.log('MQTT: subscribed to ' + topic)
          }
          // Create toast pop up (error) for unsuccessful booking attempt
          if (message.includes('err')) {
            this.createToast(
              'Sorry there seems to be a problem booking this appointment',
              'Booking Failed!',
              'danger'
            )
            console.log('MQTT: subscribed to ' + topic)
          }
          this.$store.commit('updateRecievedResponse', true) // Booking responses are reset
        }
      })
    },
    publishClinicsRequest() {
      this.$mqtt.publish('client/clinics', 'client says hi!', { qos: 0 })
    },
    subscribeToClinicsResponse() {
      this.$mqtt.subscribe('clinicmanager/clinics', (err, granted) => {
        if (err) {
          console.log(err)
        }
        this.startTimeoutClinics() // start the timer
      })
    },
    // waits for 'milliseconds' until it checks if clinics are recieved
    startTimeoutClinics() {
      const milliseconds = 5000
      setTimeout(() => {
        return this.checkClinicsRecieved() // return this method after 'milliseconds' time
      }, milliseconds)
    },
    checkClinicsRecieved() {
      console.log('MQTT: Clinics Recieved = ' + this.recievedClinics)
      if (this.recievedClinics === false) {
        this.createToast(
          'Clinics not recieved. Trying to re-connect!',
          'MQTT',
          'danger'
        )
        this.publishClinicsRequest() // publish a request for clinics again
        this.startTimeoutClinics() // start the timer again
      }
    },
    // update the clinics in the state
    storeClinics(message) {
      const parsedMessage = JSON.parse(message)
      this.$store.commit('updateJson', parsedMessage)
    }
  }
})
</script>

<style scoped>
#app {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  position: relative;
  margin: 0;
  overflow: hidden;
}

#header {
  margin-bottom: 1%;
  background: linear-gradient(
    180deg,
    rgba(35, 72, 203, 0.42) 0%,
    rgba(142, 187, 255, 0) 100%
  );
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding-left: 3%;
  height: 75px;
}

#logo {
  padding-top: 10px;
}

#footer {
  position: fixed;
  width: 100%;
  background-color: rgba(142, 187, 255, 1);
  bottom: 0;
  z-index: 100;
}

#disclaimer {
  text-align: center;
  font-style: normal;
  font-weight: normal;
  font-size: 100%;
  color: #000000;
}

#router-links {
  text-align: right;
}

.footer_link {
  text-align: end;
}

#router_wrapper {
  height: 100%;
  min-height: 89vh;
  background-color: rgb(244, 245, 246);
}

@media (max-width: 991px) {
  #disclaimer {
    font-size: 100%;
  }
}
</style>
