var mongoose = require('mongoose');
var Users = require('../models/users');

var bcrypt = require('bcrypt-nodejs');
var default_password = bcrypt.hashSync('password', bcrypt.genSaltSync(8), null);

//create a Schema
var companySchema = mongoose.Schema(
  //company
  {
    name: String,

    address: String,

    phone: String,

    shortname: String,

    control_rooms: String,

    operators_number: String,

    users: [mongoose.model('User').schema]


  }, {
  collection: 'COMPANIES'
});

//here can be added methods like validation or formatting
//encrypting password or queries

//queries


//exporting
var Company = mongoose.model('Company', companySchema);

//for exporting with multiple schemas in a single file
// module.exports = {
//   Company : Company,
//   User : User
// }

module.exports = mongoose.model('Company', companySchema);
