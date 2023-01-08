const publishTopicExample = 'client/'
const publishTopicPrefix =  'availabilityChecker/'
const subscribeClient = 'client/'

const PUBLISH_TOPICS = {
    EXAMPLE_PUBLISH_TOPIC: publishTopicExample + 'appointmentTrigger',
    AVAILABILITY_PUBLISH_TOPIC: publishTopicPrefix + 'availablities'
};
const SUBSCRIBE_TOPICS = {
    CLIENT_SUBSCRIBE_TOPIC: subscribeClient + 'appointmentTrigger'
}; 

module.exports = { PUBLISH_TOPICS, SUBSCRIBE_TOPICS}