// db transactions should follow this format to use circuitbreaker (returning a promise and rejecting or resolving it)
const Appointment = require("../Models/Appointments");

const createAppointment = (body) => {
  return new Promise((resolve, reject) => {
    const appointment = new Appointment()
    appointment.request_id = body.requestId
    appointment.dentistID = body.dentistID
    appointment.personal_number = body.userId
    appointment.issuance = body.issuance
    appointment.date = body.selectedDate
    appointment.time = body.selectedTime

    appointment.save()
      .then(data => resolve(data))
      .catch((err) => { reject({ err: err, personal_number: appointment.personal_number }) });
  })
};

module.exports = { createAppointment }