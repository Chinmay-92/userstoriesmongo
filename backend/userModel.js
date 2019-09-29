// userModel.js
var mongoose = require('mongoose');
// Setup schema
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var userSchema = mongoose.Schema({
	username: {
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});
// Export user model
var Usermodel = module.exports = mongoose.model('user', userSchema);

module.exports.get = function (callback, limit) {
    Usermodel.find(callback).limit(limit);
}