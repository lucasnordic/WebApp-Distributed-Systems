<!--
Select-a-clinic Form;
Author(s): Lucas, Adam
-->
<template>
  <b-col id="select-clinic">
    <p id="input-title">Select a Clinic:</p>

    <div
      class="accordion"
      role="tablist"
      v-for="(clinic, index) in this.$store.state.clinicJson.dentists"
      :key="clinic.id"
    >
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button
            block
            id="accordion-button"
            v-b-toggle="'accordion-' + index"
            :variant="buttonColor"
            >{{ clinic.name }}</b-button
          >
        </b-card-header>
        <b-collapse
          :id="'accordion-' + index"
          accordion="my-accordion"
          role="tabpanel"
        >
          <b-card-body id="clinic-info">
            <p>Owner: {{ clinic.owner }}</p>
            <p>Number of Dentists: {{ clinic.dentists }}</p>
            <b-button
              v-b-modal.modal-booking
              @click="onSelectAClinic(clinic)"
              style="width: 100%"
              variant="success"
              >Select Date & Time</b-button
            >
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
  </b-col>
</template>

<script>
export default {
  name: 'selectAClinicForm',
  data() {
    return {
      // accordion buttons:
      buttonColor: 'white'
    }
  },
  methods: {
    onSelectAClinic(clinic) {
      // 1. Clear selection, if selected new clinic:
      // if (clinic !== this.$store.state.selectedClinic) {
      this.resetBookingTimeDate()
      // }

      // 2. set selected clinic, reset picked date
      this.$store.commit('updateSelectedClinic', clinic)
      this.$store.commit('updateBookingForm', {
        whatToUpdate: 'dentistId',
        value: clinic.id
      })
      this.$store.commit('updateRecievedAvailabilities', false) // availabilities are reset
    },
    resetBookingTimeDate() {
      const timesArray = []
      this.$store.commit('updateSelectedTime', timesArray)
      // const dateArray = []
      // this.$store.commit('updateSelectedDate', dateArray)
    }
  }
}
</script>

<style scoped>
#select-clinic {
  padding-bottom: 45px;
  padding-left: 25px;
  padding-right: 25px;
  max-height: 100%;
}

#input-title {
  padding-bottom: 10px;
  margin: 0;
  font-weight: bold;
}

#accordion-button {
  text-align: left;
}

#clinic-info p {
  text-align: left;
  font-size: 12px;
  font-weight: bold;
  color: #525050;
}
</style>
