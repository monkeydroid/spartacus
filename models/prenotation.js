var mongoose = require('mongoose');

//create a Schema
var prenotationSchema = mongoose.Schema({

    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    location: String,

    room: String,

    phone: { type: String, required: false },

});

//exporting
//var Prenotation = mongoose.model('Prenotation', prenotationSchema);

module.exports = mongoose.model('Prenotation', prenotationSchema);