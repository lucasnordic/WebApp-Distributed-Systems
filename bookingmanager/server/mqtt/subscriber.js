// Class used to create subscriptions 

class Subscriber {
    constructor(){
    }

    subscribeToTopic(topic, client) {
        client.subscribe(topic, {qos:1})
    }

}

module.exports = Subscriber