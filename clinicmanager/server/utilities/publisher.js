/**
 * This is related to publishing
 * Author(s): Hannah
 */

const topics = require('./topics')

// Class used to publish
class Publisher {
  constructor() { }

  publishData(topic, message, client) {
    // add new topics/messages
    client.publish(topic, message, { qos: 1 });
  }
}

module.exports = Publisher;
