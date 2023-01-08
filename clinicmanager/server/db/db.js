/**
 * This is for initializing the DB
 * Author(s): Ediz
 */

// const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();

// Private db
var mongoURI = process.env.MONGODB_URI;
//var mongoURI = 'mongodb://localhost:27017/dentistDB';
const port = process.env.PORT || 3000;

// Connect to MongoDB
function connect() {
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
        if (err) {
            console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
            console.error(err.stack);
            process.exit(1);
        }
        console.log(`ClinicManager connected to MongoDB with URI: ${mongoURI}`);
    });
}

// Create Express app
// var app = express();

// app.use(express.json());

// app.listen(port, function (err) {
//     if (err) throw err;
//     console.log(`ClinicManager: `, mongoURI);
// });

module.exports = { connect: connect() }
