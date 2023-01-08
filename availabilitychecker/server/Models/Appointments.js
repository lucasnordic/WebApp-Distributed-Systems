
 const mongoose = require("mongoose");
 const Schema = mongoose.Schema;
 
 const appointmentSchema = new Schema({
     dentistID: { type: Number, required: true },
     personNummer: { type: String, required: true },
     issuance: { type: Number, required: true },
     time: [
         {
             hours: { type: Number, required: true, min: 0, max: 23 },
             minutes: { type: Number, required: true, min: 0, max: 59 },
             seconds: { type: Number, required: true, min: 0, max: 59 },
         },
     ],
     date: [{ type: Date, default: Date.now() }],
 });
 
 module.exports = mongoose.model("appointments", appointmentSchema);