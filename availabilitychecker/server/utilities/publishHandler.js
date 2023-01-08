class PublishHandler {


    userId = '';
    message = '';
    availability = [];

    constructor (userId, message, availability) {
        this.availability = availability;
        this.message = message;
        this.userId = userId;
    }
}

module.exports = PublishHandler