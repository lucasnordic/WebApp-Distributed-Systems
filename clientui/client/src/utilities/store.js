/**
 * -------------
 * Store component for saving application state
 * Creates a "store" to save data which we need to use through-out the UI
 * -------------
 * How to use:
 * 1. Get data:
 *    this.$store.state.bookingform.userId
 * 2. Change data:
 *    this.$store.commit('updateJson', value)
 * -------------
 * Author(s): Lucas, Adam
 */

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

/**
 * Functions:
 */
// For generating a timeSlot Object
// A timeSlot = { time: String, availability: String, availableDentists: Number }
function generateTimeSlot(time, available, availableDentists) {
  const totalMinutes = Math.trunc(time / 60)
  let hours = parseInt(Math.trunc(totalMinutes / 60))
  let minutes = parseInt(Math.trunc(totalMinutes % 60))
  if (minutes < 1) {
    minutes = minutes + '0'
  }
  if (hours < 10) {
    hours = '0' + hours
  }
  const timeSlot = { time: hours + ':' + minutes, available, availableDentists }
  return timeSlot
}

// Convert time of EX: '7:30' to '27000' seconds
function timeToSeconds(time, second) {
  const hoursMinutes = time.split(/[.:]/)
  const hours = parseInt(hoursMinutes[0], 10)
  const minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0
  const hoursMinutesDecimal = hours + minutes / 60
  const timeAsSeconds = hoursMinutesDecimal * second
  return timeAsSeconds
}

/**
 * Exports:
 */
const store = new Vuex.Store({
  state: {
    // Clinics recieved from ClinicManager
    clinicJson: [],
    // For storing timeslots recieved from AvailabilityChecker
    timeSlots: [],
    // Form filled for booking
    bookingForm: {
      userId: '',
      requestId: '',
      dentistId: '',
      issuance: '',
      selectedDate: [],
      selectedTime: [],
      personsInBooking: ''
    },
    // For Storing selected Clinic
    selectedClinic: {},
    selectedDay: '',
    recievedResponse: false, // For bookings
    recievedAvailabilites: false
  },
  mutations: {
    updateRecievedResponse(state, bool) {
      state.recievedResponse = bool
    },
    updateRecievedAvailabilities(state, bool) {
      state.recievedAvailabilites = bool
    },
    // Update the clinics data
    updateJson(state, message) {
      state.clinicJson = message
      console.log('STATE: The stored clinics have been updated')
    },
    /**
     * This method deals with updating the TimeSlots for the user
     * @param {*} value = value.availabilities...
     */
    updateTimeSlots(state, value) {
      // Constants:
      const s = 3600 // s = 3600 = seconds per hour
      // Split openTimes into two number values: startTime and endTime in seconds
      const generalOpenTimes = '6:00-20:00' // general open times to display on UI
      const removedColon = generalOpenTimes.replace(/:/g, '')
      const startTimeNum = parseInt(removedColon.split('-')[0]) / 100 * s
      const endTimeNum = parseInt(removedColon.split('-')[1]) / 100 * s

      // Variables:
      const availableTimes = {
        timeAsSeconds: [],
        dentists: []
      }

      state.timeSlots = [] // clear the timeSlots array; TODO: Update it instead

      // if the recieved value Object contains availabilities:
      if (value.availabilities !== undefined) {
        // Convert the time to seconds, and add times and dentists to arrays
        value.availabilities.TimeSlots.forEach(element => {
          const timeAsSeconds = timeToSeconds(element.Time, s)
          availableTimes.timeAsSeconds.push(timeAsSeconds)
          availableTimes.dentists.push(element.NumberofAvailableDentist)
        })

        // Push timeslot to timeSlots array. Set availability. set available dentists
        // TODO: Redo this horrible loop and make it more logical
        for (let i = startTimeNum; i < endTimeNum; i += s / 2) {
          let timeSlot = {}
          let loops = 0

          if (availableTimes.timeAsSeconds.includes(i)) {
            timeSlot = generateTimeSlot(i, 'available', availableTimes.dentists[loops])
            loops++ // increase the loop when adding available time-slot
          } else {
            timeSlot = generateTimeSlot(i, 'unavailable', 0)
          }
          state.timeSlots.push(timeSlot)
        }
        console.log('STATE: The time-slots have been updated')
      } else {
        console.log('STATE: The time-slots did not update')
      }
    },
    // Updates some of the data in the booking form
    updateBookingForm(state, value) {
      if (value.whatToUpdate === 'userId') state.bookingForm.userId = value.value
      if (value.whatToUpdate === 'requestId') state.bookingForm.requestId = value.value
      if (value.whatToUpdate === 'dentistId') state.bookingForm.dentistId = value.value
      if (value.whatToUpdate === 'issuance') state.bookingForm.issuance = value.value
      // if (value.whatToUpdate === 'selectedTime') Vue.set(state.bookingForm.selectedTime, value.value)
      if (value.whatToUpdate === 'personsInBooking' && value.value !== null) state.bookingForm.personsInBooking = value.value
      if (value.whatToUpdate === 'resetAll') state.bookingForm = value.value
      if (value) {
        console.log(
          'STATE: bookingForm.' + value.whatToUpdate +
          ' has been updated to: ' + JSON.stringify(value.value))
      }
    },
    updateSelectedTime(state, value) {
      // Vue.set(state.bookingForm.selectedTime, value)
      state.bookingForm = { ...state.bookingForm, selectedTime: value }
      console.log('STATE: The bookingForm.selectedTime has been changed to: ' + value)
    },
    // Only updates the selectedDate in the booking form
    updateSelectedDate(state, value) {
      state.bookingForm.selectedDate = value
      console.log('STATE: The bookingForm.selectedDate has been changed to: ' + JSON.stringify(value))
    },
    // TODO: Remove? since not used atm
    updateSelectedDay(state, value) {
      state.selectedDay = value
    },
    updateSelectedClinic(state, clinic) {
      state.selectedClinic = clinic
      console.log('STATE: The selected clinic has been changed to: ' + clinic.name)
    }
  }
})

export { store }
