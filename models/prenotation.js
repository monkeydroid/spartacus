var mongoose = require('mongoose');

//create a Schema
var prenotationSchema = mongoose.Schema({

    username: {
        type: String,
        required: true
    },
    name:String,
    surname:  String,
    location: String,

    roomId: String,
    tipology: {
        type : String,
        require: true

    },

    phone: { type: String, required: false },


});

module.exports = mongoose.model('Prenotation', prenotationSchema);