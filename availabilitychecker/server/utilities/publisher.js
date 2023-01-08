const mqttClient = require("./connect");
const topics = require('./topics')
const publishTopics = topics.PUBLISH_TOPICS;



// Class used to publish
class Publisher {
  constructor() {}

  publishMockData1() {
    // This method is only for testing. It'll be removed after we connect the repositories
    mqttClient.publish(publishTopics.EXAMPLE_PUBLISH_TOPIC, '{"selectedClinic":1,"selectedDate":"Wednesday, January 10, 2022","userId":"1111111111"}', {qos:1});
  }


  publishMockData2() {
    // This method is only for testing. It'll be removed after we connect the repositories
    mqttClient.publish(publishTopics.EXAMPLE_PUBLISH_TOPIC, '{"selectedClinic":2,"selectedDate":"Tuesday, January 21, 2022","userId":"2222222222"}', {qos:1});
  }

  publishMockData3() {
    // This method is only for testing. It'll be removed after we connect the repositories
    mqttClient.publish(publishTopics.EXAMPLE_PUBLISH_TOPIC, '{"selectedClinic":1,"selectedDate":"Tuesday, January 20, 2022","userId":"3333333333"}', {qos:1});
  }

  publishData(msg, userId) {
    var uniqueTopic = publishTopics.AVAILABILITY_PUBLISH_TOPIC + '/' + userId;
    mqttClient.publish(uniqueTopic, msg, {qos:1});
    console.log(uniqueTopic);
  }
}

module.exports = Publisher;
