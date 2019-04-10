var mongoose = require('mongoose');

//create a Schema
var prenotationSchema = mongoose.Schema({

   
    prenotation_day: {
        //type: post dei parametri che inserira l'utente ,
        type: Date,
        required: true

    },

    xml:{
        type: String
    },
    id_room:{
        type: String,
        required: true
    },
    id_user:{
        type: String,
        required: true
    },
    prenotation_time:{
        type: Date,
        default: new Date().getTime()     
    },
    event_name:{
        type: String,
        required: true
    },
    tipology:{
        type: String,
        required:true
    } 


});

module.exports = mongoose.model('Prenotation', prenotationSchema);