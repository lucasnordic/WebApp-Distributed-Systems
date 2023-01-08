/**
 * Author(s): Adam, Lucas
 */

var mongoose = require("mongoose");
var clinicModel = require('../Models/Clinics');
var jsonFile = require('../Json/jsonFile.json');
var clinicsUpload = clinicModel(jsonFile);


/**
 * Local functions
 */

// count documents in database
function countDocs() {
    clinicModel.countDocuments({}, function (err, count) {
        console.log("Number of documents in DB", count);
        if (count < 1) {
            saveDocs()
        } else {
            console.log("Won't upload jsonFile to DB");
        }
    });
}

// save documents to database
function saveDocs() {
    clinicsUpload.save(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log(doc);
        }
    });
}


/**
 * Exported functions
 */

// add documents to database
exports.addDocs = function () {
    countDocs()
};


// Gets clinics from database and converts it to json
exports.getDocs = async function () {
    // count the documents in DB before continuing
    countDocs()

    const document = await clinicModel.find({})
    const dentists = document[0].dentists
    const dentistsObj = {
        dentists: dentists
    }
    const str = JSON.stringify(dentistsObj);
    // const json = JSON.parse(str);
    return str;
}
