const publishTopicPrefix = 'bookingmanager/'
const subscribeTopicPrefix = 'client/'

const PUBLISH_TOPICS = {
    BOOKING_RESPONSE: publishTopicPrefix + 'booking/userId',
};
const SUBSCRIBE_TOPICS = {
    BOOKING_REQUEST: subscribeTopicPrefix + 'bookingrequest'
};

module.exports = { PUBLISH_TOPICS, SUBSCRIBE_TOPICS }