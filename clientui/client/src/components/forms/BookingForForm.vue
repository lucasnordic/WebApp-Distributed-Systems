<!--
Booking-for Form;
Author(s): Lucas,
-->
<template>
  <b-col id="select-booking">
    <b-form>
      <p id="input-title">Booking for:</p>
      <b-form-group
        id="input-group-2"
        label-for="input-2"
        description="You can only do a group booking on the same day"
      >
        <b-form-select
          id="input-2"
          :value="persons"
          @input="updatePersonsInBooking"
          :options="people"
          required
        ></b-form-select>
      </b-form-group>
    </b-form>
  </b-col>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'bookingForForm',
  data() {
    return {
      people: [
        { text: 'Select how many will be booked', value: null },
        { text: '1 Person', value: '1' },
        { text: '2 People', value: '2' },
        { text: '3 People', value: '3' },
        { text: '4 People', value: '4' }
      ]
    }
  },
  methods: {
    // This allows updating the persons in a booking
    updatePersonsInBooking(e) {
      this.$store.commit('updateBookingForm', {
        whatToUpdate: 'personsInBooking',
        value: e
      })
    }
  },
  computed: {
    // This helps in binding the value for personsInBooking
    ...mapState({
      persons: (state) => state.bookingForm.personsInBooking
    })
  }
}
</script>

<style>
#input-title {
  padding-bottom: 10px;
  margin: 0;
  font-weight: bold;
}

#select-booking {
  /* background-color: rgba(211, 240, 255, 0.1); */
  padding-left: 25px;
  padding-right: 25px;
  padding-top: 15px;
}

</style>
