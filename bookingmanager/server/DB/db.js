/**
 * This is for initializing the DB
 * Author(s): Ediz
 */

const mongoose = require("mongoose");
require('dotenv').config();

// Public db
var mongoURI = process.env.MONGODB_URI;
//var mongoURI = 'mongodb://localhost:27017/dentistDB';

// Connect to MongoDB
function connect() {
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
        if (err) {
            console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
            console.error(err.stack);
            process.exit(1);
        }
        console.log(`Bookingmanager connected to MongoDB with URI: ${mongoURI}`);
    });
}

module.exports = { connect: connect() }