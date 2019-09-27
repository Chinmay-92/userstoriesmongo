// Import Exercisemodel model
Exercisemodel = require('./exerciseModel');
ExerciseUserModel = require('./exerciseUserModel');

// Handle index actions
exports.index = function (req, res) {
    Exercisemodel.get(function (err, Exercisemodels) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Exercises retrieved successfully",
            data: Exercisemodels
        });
    });
};

exports.getExerciseByUserId = function(id, res) {
        console.log("searching exercises for "+id);
        ExerciseUserModel.find({
                    user_id: id,
            }, function(err, data){
            if(err){
                console.log(err);
                return;
            }

            if(data.length == 0) {
                console.log("No record found")
                return;
            }
            console.log("exercies found: ",data)
            res.data = data;
            //return data;
        })
}
// Handle create Exercisemodel actions
exports.new = function (req, res) {
        Usermodel.findById(req.body.user_id, function(err,userModel) {
            if (err)
                    res.json(err);

            let user = userModel;
            console.log(user);
            let exercisemodel = new Exercisemodel();
            let array;
            array = exports.getExerciseByUserId(user._id, function(err, data) {
                array = data;
                console.log("inside this"+array);
                array.indexOf(req.body.description) === -1 ? array.push(req.body.description) : res.status(400).send({message: 'Unable to create exercise, duplicate entry'});
                exercisemodel.user_id = req.body.user_id;
                exercisemodel.description = req.body.description;
                exercisemodel.duration = req.body.duration; 
                if (req.body.date !== 'undefined')
                    exercisemodel.date = req.body.date;

                exercisemodel.save(function (err,exercise) {
                    if (err)
                        res.json(err);

                    ExerciseUserModel.create({
                                        exercise_id: exercise.id,
                                        user_id: req.body.user_id
                                    })
                    res.json({
                        message: "New Exercise created for the user "+user.name+"!",
                        data: exercisemodel
                    });
                });
        })
        });

}
// Handle view Exercisemodel info
exports.view = function (req, res) {
        ExerciseUserModel.find({
                where: {
                    user_id: req.params.user_id,
                },
            }, function(err, data){
            if(err){
                console.log(err);
                res.json(err);
            }

            if(data.length == 0) {
                console.log("No record found")
                    res.json({
                        message: 'No record found',
                        data: []
                    });            }else
            Exercisemodel.findById(data[0].exercise_id, function (err, exerciseModels) {
                    if (err)
                        res.send(err);
                    res.json({
                        message: 'Exercisemodel details',
                        data: exerciseModels
                    });
                });
        })
        
};
// Handle update Exercisemodel info
exports.update = function (req, res) {

    if(!req.body.name) {
        return res.status(400).send({
            message: "Exercise name can not be empty"
        });
    }

    // Find note and update it with the request body
    Exercisemodel.findByIdAndUpdate(req.params.exercise_id, {
        name: req.body.name,
    }, {new: true})
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Exercise not found with id " + req.params.exercise_id
            });
        }
        res.send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Exercise not found with id " + req.params.exercise_id
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.exercise_id
        });
    });


};
// Handle delete Exercisemodel
exports.delete = function (req, res) {

     Exercisemodel.findByIdAndRemove(req.params.exercise_id)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "user not found with id " + req.params.exercise_id
            });
        }
        res.send({message: "user deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Exercise not found with id " + req.params.exercise_id
            });                
        }
        return res.status(500).send({
            message: "Could not delete user with id " + req.params.exercise_id
        });
    });
};