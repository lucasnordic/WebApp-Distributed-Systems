var clinicModel = require('../Models/Clinics');
var appointmentModel = require('../Models/Appointments');

// clinics from database as json
exports.getClinicDocs = async function () {
    const document = await clinicModel.find({})
    const dentists = document[0].dentists
    const dentistsObj = {
        dentists: dentists
    }
    const str = JSON.stringify(dentistsObj);
    const json = JSON.parse(str);
    //return str;
    return json;
}

// appointments from database as json
exports.getAppointmentDocs = async function () {
    return new Promise((resolve, reject) => {
        appointmentModel.find()
        .then(data => resolve({ msg: data }))
        .catch(err =>  reject({err: err }))
      })
    
    /*const document = await appointmentModel.find({})
    const appointments = document[0].appointments
    const appointmentsObj = {
        appointments: appointments
    }
    const str = JSON.stringify(appointmentsObj);
    const json = JSON.parse(str);
    //return str;
    return json; */
}