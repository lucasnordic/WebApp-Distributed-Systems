/**
 * This is for initializing MQTT
 * Author(s): Hannah, Lucas
 */
const Publisher = require("./publisher");
const Subscriber = require("./subscriber");
const topics = require('./topics');
const mqtt = require('mqtt')
const clinicController = require('../Controller/ClinicController')

const subscribeTopics = topics.SUBSCRIBE_TOPICS;
const publishTopics = topics.PUBLISH_TOPICS;
const publish = new Publisher();
const subscribe = new Subscriber();

const connect = {
  host: 'localhost',
  port: 1884,
  endpoint: '/mqtt',
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 4000,
  clientId: 'team-10-dentistimo-clinicmanager',
  username: 'team_10',
  password: 'team_10'
}
const connectUrl = `mqtt://${connect.host}:${ connect.port}${connect.endpoint}`
const client = mqtt.connect(connectUrl, connect);


/**
 * Class used to handle anything mqtt related
 */
class MqttClient {
  constructor() {
    // Connect
    client.on("connect", function () {
      console.log("Connected");
    });

    // Subscribe
    subscribe.subscribeToTopic(subscribeTopics.CLINICS_SUB, client);

    // Recieve messages and do things
    client.on("message", function (topic, message) {
      console.log(message.toString());
      // do something with message received
      if (topic === subscribeTopics.CLINICS_SUB) {
        clinicController.getDocs().then((res) => {
          console.log('MQTT message published');
          publish.publishData(publishTopics.CLINICS_PUB, res, client);
        }).catch((err) => {
          console.log(err);
        });
      }
    });

    client.on('close', () => {
      console.log(`mqtt client disconnected`);
    });

    client.on("error", (error) => {
      console.log("Connection failed", error);
    });
  }
}

module.exports = MqttClient;