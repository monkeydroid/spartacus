var mongoose = require('mongoose');

//create a schema

var prenotazioneSchema = mongoose.Schema({

    timestamp: {
        //type: post dei parametri che inserira l'utente ,
        required: true

    },
    xml:{
        type: String[30]
    },
    nome_aula:{
        type: String[10],
        required: true
    },
    utente:{
        type: String[40],
        required: true
    },
    istante_prenotazione:{
      
        default: new Date().getTime()     
    },
    nome_evento:{
        type: String[50],
        required: true
    },
    pagamento_verifica:{
            type: Boolean
            
    },
    scadenza:{
            type: Date()+7
    }
    

});

//exporting
var prenotazione = mongoose.model('prenotazione', prenotazioneSchema);

// module.exports = {
//   User : User
// }

module.exports = mongoose.model('aprenotazione',prenotazioneSchema);