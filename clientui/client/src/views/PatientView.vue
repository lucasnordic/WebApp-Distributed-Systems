<!--
This is the Patient view which contains: Map, PatientSidebar
Author(s): Lucas
-->

<template>
  <div>
    <b-container class="bv-container">
      <b-row class="bv-row">
        <!-- SIDEBAR -->
        <b-col align-self="stretch" lg="4" id="sidebar">
          <patient-sidebar />
        </b-col>
        <!-- MAP -->
        <b-col align-self="stretch" lg="8" id="map">
          <mapBox />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Map from '../components/Map.vue'
import PatientSidebar from '../components/PatientSidebar.vue'

export default {
  name: 'PatientPage',
  components: {
    mapBox: Map,
    PatientSidebar
  },
  methods: {},
  created() {
    // If the userId becomes empty, send back to home
    // TODO: Save important data in other places too and not only in the state
    const userLoggedIn = this.checkIfLoggedIn
    if (!userLoggedIn) {
      // TODO: Show error message if user is logged out
      this.$router.push('/')
      this.$router.go() // force page refresh in order to stop errors
    }
  },
  mounted() {
    // TODO: find a better fix for why the map is not loaded on login
    // Temp fix: The json has to be re-saved here in order for the map to load:
    this.$store.commit('updateJson', this.$store.state.clinicJson)
  },
  computed: {
    // check if user is actually "logged in"
    checkIfLoggedIn() {
      const userId = this.$store.state.bookingForm.userId
      if (userId === '' || userId === undefined || userId === null) {
        return false
      }

      return true
    }
  }
}
</script>

<style scoped>
.bv-container {
  margin: 0;
  width: 100%;
  height: 100%;
  bottom: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.bv-row {
  padding: 7.5px;
  display: flex;
  flex-wrap: wrap;
  margin-right: 0px;
  margin-left: 0px;
  position: absolute;
  top: 75px;
  bottom: 60px;
  left: 0;
  right: 0;
  background-color: rgb(244, 245, 246);
  min-height: 89vh;
}

#map {
  border-top: 6px solid rgb(248, 182, 106);
}

#sidebar {
  margin: 0;
  padding-left: 7.5px;
  padding-right: 7.5px;
  /* border-left: 0.5rem solid;
  border-color: rgb(244, 245, 246); */
  height: 100%;
  overflow-y: scroll;
}

@media (max-width: 991px) {
  .bv-row {
    overflow: auto;
  }

  #map {
    height: 55%;
  }

  #sidebar {
    border: 0;
    overflow: auto;
    padding: 0px;
    /* overflow: hidden; */
  }
}
</style>
