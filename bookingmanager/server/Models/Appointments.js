/**
 * This is the schema for appointments in the DB
 * Author(s): Ediz
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const appointmentSchema = new Schema({
	request_id: { type: Number, required: true },
	dentistID: { type: Number, required: true },
	personal_number: { type: String, required: true },
	issuance: { type: String, required: true },
	time: { type: [], required: true },
	date: { type: [], required: true },
});

module.exports = mongoose.model("appointments", appointmentSchema);

module.exports = mongoose.model("appointments", appointmentSchema);