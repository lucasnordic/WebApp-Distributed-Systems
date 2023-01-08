/**
 * This is for initializing MQTT
 * Author(s): Hannah, Lucas
 */

const CircuitBreaker = require("opossum");
const circuitSettings = require("../breaker/breaker");
const appointmentController = require("../controllers/controllers.appointments");

const Publisher = require("./publisher");
const Subscriber = require("./subscriber");
const topics = require("./topics");
const subscribeTopics = topics.SUBSCRIBE_TOPICS;
const publishTopics = topics.PUBLISH_TOPICS;

const mqtt = require("mqtt");
const connection = require("./connect");
const publish = new Publisher();
const subscribe = new Subscriber();

const client = mqtt.connect(connection.connectUrl, connection.connect);

/**
 * Class used to handle anything mqtt related
 */
class MqttClient {
  constructor() {
    // Connect
    client.on("connect", function () {
      console.log("Connected");
    });

    // create a new breaker for the creation of booking
    const breaker = new CircuitBreaker(
      appointmentController.createAppointment,
      circuitSettings.options
    );
    circuitSettings.addSettings(breaker);

    // subscribe to booking request from clientui
    subscribe.subscribeToTopic(subscribeTopics.BOOKING_REQUEST, client)

    // Receive messages and do stuff
    client.on("message", function (topic, message) {
      console.log("Topic: " + topic + " " + message.toString());
      // do something with message received
      if (topic === subscribeTopics.BOOKING_REQUEST) {
        breaker
          .fire(JSON.parse(message))
          .then((data) =>
            // the booking is created successfully publish a response to clientui
            publish.publishData(
              publishTopics.BOOKING_RESPONSE + "/" + data.personal_number,
              JSON.stringify(data),
              client
            )
          )
          .catch((err) =>
            // creation of booking fails, err is sent back to clientui
            publish.publishData(
              publishTopics.BOOKING_RESPONSE + "/" + err.personal_number,
              JSON.stringify(err),
              client
            )
          );
      }
    });

    client.on("close", () => {
      console.log(`mqtt client disconnected`);
    });

    client.on("error", (error) => {
      console.log("Connection failed", error);
    });
  }
}

module.exports = MqttClient;
