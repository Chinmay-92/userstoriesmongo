var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
// Setup schema
var exerciseuserSchema = mongoose.Schema({
    exercise_id: {
        type: ObjectId
    },
    user_id: {
        type: ObjectId
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});
// Export user model
var ExerciseUsermodel = module.exports = mongoose.model('exerciseUsermodel', exerciseuserSchema);

module.exports.get = function (callback, limit) {
    ExerciseUsermodel.find(callback).limit(limit);
}