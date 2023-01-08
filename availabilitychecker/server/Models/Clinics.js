
 var mongoose = require("mongoose");
 var Schema = mongoose.Schema;
 
 var clinicSchema = new Schema({
     dentists: [{
         _id: mongoose.Schema.Types.ObjectId,
         id: { type: Number, required: true },
         name: { type: String, required: true },
         owner: { type: String, required: true },
         dentists: { type: Number, required: true },
         address: { type: String, required: true },
         city: { type: String, required: true },
         coordinate: {
             longitude: { type: Number, required: true },
             latitude: { type: Number, required: true }
         },
         openinghours: {
             monday: { type: String, required: true },
             tuesday: { type: String, required: true },
             wednesday: { type: String, required: true },
             thursday: { type: String, required: true },
             friday: { type: String, required: true }
         }
     }]
 });
 
 module.exports = mongoose.model("clinics", clinicSchema);