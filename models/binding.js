var mongoose = require('mongoose');

//create a Schema
var bindingSchema = mongoose.Schema({
  id_device : String,
  id_user: String,
  id_qr : String,
  start : Date,
  end: Date,
  lat : Number,
  lng : Number,
  busy : Boolean
});


module.exports = mongoose.model('Binding', bindingSchema);
