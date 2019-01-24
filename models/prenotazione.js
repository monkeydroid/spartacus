var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//create a Schema
var prenotazioneSchema = mongoose.Schema({

    giorno: {
        type: Number,
        required: true
    },
    mese: {
        type: Number,
        required: true
    },
    anno: {
        type: String,
        required: true
    },
    oraInizio: {
        type: Number,
        required: true
    },
    oraFine: {
        type: Number,
        required: true
    },
    xml: {
        type: String,
        required: true
    },
});

//exporting
var Aula = mongoose.model('Aula', aulaSchema);

// module.exports = {
//   User : User
// }

module.exports = mongoose.model('Aula', aulaSchema);