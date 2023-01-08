const mqttClient = require('./connect')

// Class used to create subscriptions 

class Subscriber {
    constructor(){
    }

    subscribeToTopic(topic) {
        mqttClient.subscribe(topic)
    }

}

module.exports = Subscriber