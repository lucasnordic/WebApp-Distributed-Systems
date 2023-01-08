// Class used to publish

class Publisher {
  constructor() {}

  publishData(topic, message, client) {
    // add new topics/messages
    client.publish(topic, message, {qos:1});
  }
}

module.exports = Publisher;
