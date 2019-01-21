var mongoose = require('mongoose');

//create a Schema
var deviceSchema =  mongoose.Schema ({
  id: String,
  model: String,
  serial: String,
  id_company: String,
  provided: Boolean,
  assigned: Boolean
});

createDevice = function(data) {

  var device = new Device({
    id : data.id,
    model: data.model,
    serial: data.serial,
    id_company: data.id_company,
    provided: data.provided,
    assigned: data.assigned
  });
  device.save(function(err) {
    if (err) {
      return false;
    }
    return true;
  });

};

module.exports = mongoose.model('Device', deviceSchema);
