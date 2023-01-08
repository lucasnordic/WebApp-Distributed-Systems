<!--
This is a single-file-component used for displaying a sidebar on the Patient page.
https://vuejs.org/v2/guide/single-file-components.html
Author(s): Lucas,
-->
<template>
  <div id="patient-sidebar">
    <!-- Booking POPUP; Deals with selecting time and date; -->
    <booking-popup />

    <!-- BOOKING CONFIRMATION POPUP -->
    <booking-confirm />

    <!-- PATIENT SIDEBAR -->
    <!-- BOOKING-FOR FORM -->
    <!-- <booking-for-form /> -->
    <!-- NEW ROW -->
    <!-- <div class="w-100"></div> -->

    <!-- SELECT A CLINIC -->
    <select-a-clinic-form />
  </div>
</template>

<script>
import BookingConfirm from './popups/BookingConfirmPopup.vue'
// import BookingForForm from './forms/BookingForForm.vue'
import SelectAClinicForm from './forms/SelectAClinicForm.vue'
import BookingPopup from './popups/BookingPopup.vue'

export default {
  name: 'patientSidebar',
  components: {
    BookingConfirm,
    // BookingForForm,
    SelectAClinicForm,
    BookingPopup
  }
}
</script>

<style>
.pointer {
  cursor: pointer;
}

#patient-sidebar {
  /* border-left: 2px solid rgb(106, 172, 248, 1);
  border-right: 2px solid rgb(106, 172, 248, 1); */
  border-top: 6px solid rgb(106, 172, 248);
  background-color: rgb(255, 255, 255);
  top: 95px;
  bottom: 0;
  left: 0;
  right: 0;
  padding-top: 10px;
  text-align: left;
  height: 100%;
}

/** SCALING, RESPONSIVENESS */
@media (max-width: 991px) {
  #patient-sidebar {
    height: 80vh;
    background-color: white;
    /* position: absolute; */
  }

  .container {
    max-width: 100% !important;
  }
}
.modal-body {
  padding: 0rem;
}
</style>
