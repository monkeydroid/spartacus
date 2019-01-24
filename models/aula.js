var mongoose = require('mongoose');

var bcrypt = require('bcrypt-nodejs');

//create a Schema
var aulaSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    posti: {
        type: Number,
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
    lim: {
        type: boolean,
        required: true
    },
    proiettore: {
        type: boolean,
        required: true
    },
    nComputer: {
        type: Number,
        required: true
    },
});

//exporting
var Aula = mongoose.model('Aula', aulaSchema);

// module.exports = {
//   User : User
// }

module.exports = mongoose.model('Aula', aulaSchema);