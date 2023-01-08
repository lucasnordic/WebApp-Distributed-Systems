<!--
APPOINTMENT POP-UP; Deals with showing the users appointment;
Author(s): Lucas,
-->
<template>
  <div id="appointment-popup-wrapper">
    <!-- TODO: Replace with a link in the header -->
    <b-button variant="primary" v-b-modal.modal-center id="appintment-button"
      >Your appointment</b-button
    >
    <b-modal id="modal-center" centered title="Your appointment" hide-footer>
      <div id="component-wrapper">
        <b-container class="bv-example-row">
          <b-row>
            <b-col cols="4">Clinic:</b-col>
            <!--
            TODO: Replace with real data from successfull booking;
            Using inputed data ATM;
            -->
            <b-col
              ><div v-if="this.$store.state.bookingForm.dentistId !== null">
                Dentist 123{{ this.$store.state.bookingForm.dentistId }}
              </div></b-col
            >
            <div class="w-100"></div>
            <b-col cols="4">Date:</b-col>
            <!-- TODO: Replace with real data -->
            <b-col>{{ this.$store.state.bookingForm.selectedDate[0] }}</b-col>
            <div class="w-100"></div>
            <b-col cols="4">Time(s):</b-col>
            <!-- TODO: Replace with real data -->
            <b-col>{{ this.$store.state.bookingForm.selectedTime[0] }}</b-col>
            <div class="w-100"></div>
            <b-col cols="4">People:</b-col>
            <!-- TODO: Replace with real data -->
            <b-col>{{ this.$store.state.bookingForm.personsInBooking }}</b-col>
          </b-row>
        </b-container>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'appointmentPopup'
}
</script>

<style>
#appointment-popup-wrapper {
  float: right;
  padding-top: 18px;
  padding-right: 17px;
}

#component-wrapper {
  padding-bottom: 15px;
  padding-top: 10px;
}

#appointment-button {
  padding: 10px;
}
</style>
