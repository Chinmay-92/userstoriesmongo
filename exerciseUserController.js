// Import ExerciseUserModel model
// Handle index actions
exports.index = function (req, res) {
    ExerciseUserModel.get(function (err, ExerciseUserModels) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "ExerciseUserModels retrieved successfully",
            data: ExerciseUserModels
        });
    });
};
// Handle create ExerciseUserModel actions
exports.new = function (req, res) {
    var usermodel = new ExerciseUserModel();
    usermodel.name = req.body.name ? req.body.name : usermodel.name;
// save the ExerciseUserModel and check for errors
    usermodel.save(function (err) {
        // if (err)
        //     res.json(err);
    res.json({
            message: 'New ExerciseUserModel created!',
            data: usermodel
        });
    });
};
// Handle view ExerciseUserModel info
exports.view = function (req, res) {
    ExerciseUserModel.findById(req.params.user_id, function (err, usermodel) {
        if (err)
            res.send(err);
        res.json({
            message: 'ExerciseUserModel details',
            data: usermodel
        });
    });
};
// Handle update ExerciseUserModel info
exports.update = function (req, res) {

    if(!req.body.name) {
        return res.status(400).send({
            message: "User name can not be empty"
        });
    }

    // Find note and update it with the request body
    ExerciseUserModel.findByIdAndUpdate(req.params.user_id, {
        name: req.body.name,
    }, {new: true})
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "User not found with id " + req.params.user_id
            });
        }
        res.send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.user_id
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.user_id
        });
    });


};
// Handle delete ExerciseUserModel
exports.delete = function (req, res) {

     ExerciseUserModel.findByIdAndRemove(req.params.user_id)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "user not found with id " + req.params.user_id
            });
        }
        res.send({message: "user deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params.user_id
            });                
        }
        return res.status(500).send({
            message: "Could not delete user with id " + req.params.user_id
        });
    });
};