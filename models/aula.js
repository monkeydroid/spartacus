var mongoose = require('mongoose');

//create a schema

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
    lim: Boolean,
    proiettore: Boolean,
        
    ncomputer: Number


});

//exporting
var Aula = mongoose.model('Aula', aulaSchema);

// module.exports = {
//   User : User
// }

module.exports = mongoose.model('Aula', aulaSchema);