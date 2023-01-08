<!--
This vue contains the homepage and related code
Author(s): Maryam, Adam, Lucas
-->

<template>
  <div>
    <b-container fluid="md">
      <b-row>
        <b-col>
          <img src="@/assets/images/patient.png" class="images" />
          <button class="home-btns" @click="loginPatient">Patient</button>
        </b-col>
        <b-modal class="modal" hide-footer hide-header ref="modal-patient">
          <div class="d-block text-center">
            <h4>Personal ID:</h4>
            <b-form-input
              class="rounded-pill"
              type="text"
              :value="userId"
              @input="updateUserId"
              placeholder="YYMMDD-XXXX"
            />
            <br />
            <br />
            <button class="confirm-btns" @click="confirmPatient">
              Confirm
            </button>
          </div>
        </b-modal>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'home',
  data() {
    return {}
  },
  methods: {
    loginPatient() {
      this.$refs['modal-patient'].show()
    },
    confirmPatient() {
      const user = this.$store.state.bookingForm.userId
      if (user > 1000000000 && user < 10000000000) {
        this.$refs['modal-patient'].hide()
        this.$router.push('/patient')
      } else {
        this.$store.commit('updateBookingForm', {
          whatToUpdate: 'userId',
          value: ''
        })

        this.toaster(
          'Log-in Error',
          'Your personnumer is invalid. Please try again.',
          'danger',
          true
        )
        this.$refs['modal-patient'].hide()
      }
    },
    toaster(title, message, variant, solid) {
      this.$bvToast.toast(message, {
        title: title,
        variant,
        solid
      })
    },
    // This allows updating the userId
    updateUserId(e) {
      this.$store.commit('updateBookingForm', {
        whatToUpdate: 'userId',
        value: e
      })
    }
  },
  computed: {
    // This helps in binding the value for personsInBooking
    ...mapState({
      userId: (state) => state.bookingForm.userId
    })
  }
}
</script>

<style scoped>
.images {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 40%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.home-btns {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border: none;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 25px;
  border-radius: 15px;
  width: 40%;
  height: 20%;
  background-color: rgba(129, 178, 252, 1);
  font-style: normal;
  font-weight: bold;
  font-size: 3vw;
  text-align: center;
  color: #000000;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
.home-btns:hover {
  background-color: rgba(52, 108, 191, 1);
  color: white;
}

input {
  text-align: center;
  border: 0.5px solid black;
}

h4 {
  font-family: sans-serif;
  text-align: center;
  font-weight: bold;
}

.confirm-btns {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border: none;
  border-radius: 15px;
  width: 40%;
  height: 20%;
  background-color: rgb(65, 228, 100);
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 150%;
  text-align: center;
  color: #000000;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
.confirm-btns:hover {
  background-color: rgb(23, 230, 68);
  color: white;
}

.modal {
  background: linear-gradient(
    180deg,
    rgba(35, 72, 203, 0.42) 0%,
    rgba(142, 187, 255, 0) 100%
  );
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  margin-bottom: 1%;
}

.modal-body {
  background: linear-gradient(
    180deg,
    rgba(35, 72, 203, 0.42) 0%,
    rgba(142, 187, 255, 0) 100%
  );
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
