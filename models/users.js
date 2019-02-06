var mongoose = require('mongoose');

var bcrypt = require('bcrypt-nodejs');
var default_password = bcrypt.hashSync('password', bcrypt.genSaltSync(8), null);

//create a Schema
var userSchema = mongoose.Schema({
//utilizzo dell mail al posto del normale users
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        default: default_password
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    
   
    categoria: {

        type: Boolean,

    },
    access_level:{

        type: Number,
        required: true

    }
   
  
});

//here can be added methods like validation or formatting
//encrypting password or queries

// generating a hash
var generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
    //return true;
};

//queries


//exporting
var User = mongoose.model('User', userSchema);

// module.exports = {
//   User : User
// }

module.exports = mongoose.model('User', userSchema);