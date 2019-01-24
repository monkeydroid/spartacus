var mongoose = require('mongoose');

//create a schema

var aulaSchema = mongoose.Schema({

    name: {
        type: String[50],
        required: true
    },
    posti: {
        type: Number,
        required: true
    },
    tipo: {
        type: String[20],
        required: true
    },
    lim: {
        type: Boolean,
        
    },
    proiettore: {
        type: Boolean,
        
    },
    ncomputer: {
     type: Number,
       
    }

});

//exporting
var aula = mongoose.model('aula', aulaSchema);

// module.exports = {
//   User : User
// }

module.exports = mongoose.model('aula', aulaSchema);