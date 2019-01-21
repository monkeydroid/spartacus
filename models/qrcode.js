var mongoose = require('mongoose');

//mongoose.connect("mongodb://192.168.1.7/eye4taskDb");
//var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));

//create a Schema
var qrcodeSchema = mongoose.Schema({
  id_qrcode: String,
  incremental : Number,
  id_company: String,
  assigned: Boolean
});

qrcodeSchema.statics.insertNewQR = function(data) {
  var qrCode = new Qrcode({
    id_qrcode : data.id_company+"_"+data.incr,
    incremental : data.incr,  //increment took from last inserted of a company from frontend
    id_company: data.id_company,
    assigned: false
  });
  qrCode.save(function(err) {
    if (err) {
      return false;
    }

    return true;
  });

};


module.exports = mongoose.model('Qrcode', qrcodeSchema);
