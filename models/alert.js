var mongoose = require('mongoose');

module.exports = mongoose.model('alert', {
	operator : String,
	status : Number,
	textStatus : String,
	device : String,
	company : String,
  lat : Number,
  lon : Number,
	date : Number
});


// //NEW
// var mongoose = require('mongoose');
//
// var alertSchema =  mongoose.Schema ({
//   id_user: Number,
//   status : String,
// 	  lat : Number,
// 	  lng : Number,
// 		date : Date
// });
//
// createAlert = function(data) {
//
//   var alert = new Alert({
//     id_user : data.id,
//     status: data.status,
//     lat: data.lat,
//     lng: data.lng,
//     name: data.name,
//     date: data.date
//   });
//   company.save(function(err) {
//     if (err) {
//       return false;
//     }
//     return true;
//   });
//
// };
//
// module.exports = mongoose.model('Alert', alertSchema);
