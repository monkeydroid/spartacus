var mongoose = require('mongoose');

module.exports = mongoose.model('instruction', {
	operator : String,
			text : String,
			date : Number
});

