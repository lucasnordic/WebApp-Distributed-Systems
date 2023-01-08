/**
 * This is for configuring topics to publish and subscribe to.
 * Author(s): Hannah, Lucas
 */

const publishTopicPrefix = 'clinicmanager/'
const subscribeTopicPrefix = 'client/'

const PUBLISH_TOPICS = {
    EXAMPLE_PUBLISH_TOPIC: publishTopicPrefix + 'example',
    CLINICS_PUB: publishTopicPrefix + 'clinics',
    // TODO Implement publishing a single clinic:
    CLINIC_PUB: publishTopicPrefix + 'clinic' + '/clinic_id'
};
const SUBSCRIBE_TOPICS = {
    EXAMPLE_SUBSCRIBE_TOPIC: subscribeTopicPrefix + 'hi',
    CLINICS_SUB: subscribeTopicPrefix + 'clinics',
    // TODO Implement subscribing for requests for a specific clinic:
    CLINIC_SUB: subscribeTopicPrefix + 'clinic' + '/clinic_id'
};

module.exports = { PUBLISH_TOPICS, SUBSCRIBE_TOPICS }