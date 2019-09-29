// userModel.js
var mongoose = require('mongoose');
// Setup schema
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var exerciseSchema = mongoose.Schema({
	user_id: {
		type: ObjectId
	},
    description: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        default: Date.now,
        required: false
    }
});
// Export user model
var exercise = module.exports = mongoose.model('exercise', exerciseSchema);

module.exports.get = function (callback, limit) {
    exercise.find(callback).limit(limit);
}