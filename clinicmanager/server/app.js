/**
 * This is for initializing MQTT, the DB, Mongoose and starting the server
 * Author(s): Hannah, Ediz, Lucas, Adam
 */

/**
 * DB implementation
 */
const db = require("./db/db");
const clinicController = require('./Controller/ClinicController');
db.connect;
clinicController.addDocs();
//clinicController.getDocs();


/**
 * MQTT implementation
 */
const MqttClient = require("./utilities/mqttClient");
const mqttClient = new MqttClient;