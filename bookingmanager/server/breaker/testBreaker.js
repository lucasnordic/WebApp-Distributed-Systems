// to test the breaker, simply run this file `node server/breaker/testBreaker.js  `

const CircuitBreaker = require("opossum");
const circuitSettings = require('./breaker')
const appointmentController = require("../controllers/controllers.appointments");
const db = require("../DB/db"); 
db.connect;

// use a breaker to test creation of a booking
const breaker = new CircuitBreaker(appointmentController.createAppointment, circuitSettings.options);
circuitSettings.addSettings(breaker)

// will pass because it follows schema
const successfulBooking = {
  dentistID: 2,
  userId: "3323",
  issuance: 12,
  selectedDate: Date.now(),
  selectedTime: [{ hours: 12, minutes: 20, seconds: 30 }],
}

// will fail because of required fields not added
const unsuccessfulBooking = {
  userId: '3323'
}
  function pass(){
    breaker.fire(successfulBooking).then(console.log).catch(console.error);
  }
  
  function fail(){
    breaker.fire(unsuccessfulBooking).then(console.log).catch(console.error);
  }

  // cause breaker to open by exceeding threshold of failures
  fail()
  fail()
  fail()
  fail()
  fail()
  fail()
  fail()
  fail()
  fail()
  fail()
  fail()
  fail()
  fail()
  fail()
  fail()
  fail()
  fail()
  fail()
  fail()
  // wait until breaker is in half open state and try a successful event, will close the breaker
  setTimeout(pass,6000)