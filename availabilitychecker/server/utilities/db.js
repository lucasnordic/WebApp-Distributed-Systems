const mongoose = require("mongoose");
var mongoURI = process.env.MONGODB_URI;
//var mongoURI = 'mongodb://localhost:27017/dentistDB';

function connect() {
    console.log("ENV:", process.env.MONGODB_URI);
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
        if (err) {
            console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
            console.error(err.stack);
            process.exit(1);
        }
        console.log(`AvailabilityChecker connected to MongoDB with URI: ${mongoURI}`);
    });
}

module.exports = { connect: connect() }