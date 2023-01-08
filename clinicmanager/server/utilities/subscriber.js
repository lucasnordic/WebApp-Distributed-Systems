/**
 * This is related to subscribing
 * Author(s): Hannah
 */

class Subscriber {
    constructor() {
    }

    subscribeToTopic(topic, client) {
        client.subscribe(topic)
    }

}

module.exports = Subscriber