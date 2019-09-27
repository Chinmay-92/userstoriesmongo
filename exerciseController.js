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

exports.getExerciseByUserId = function(user, req, res) {
        console.log("searching exercises for "+user._id);
        ExerciseUserModel.find({
                    user_id: user._id,
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
            array = data;
            let exercisemodel = new Exercisemodel();
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
            let array;
            if(user == null)
            {
                res.json({
                    status: "error",
                    message: "UserId is invalid",
                });
                return;
            }
            array = exports.getExerciseByUserId(user, req, res);                
        });

}
// Handle view Exercisemodel info
exports.view = function (req, res) {

    Usermodel.findById(req.params.user_id, function(err,userModel) {
            if (err)
                    res.json(err);

            let user = userModel;
            console.log(user);
            let array;
            if(user == null)
            {
                res.json({
                    status: "error",
                    message: "UserId is invalid",
                });
                return;
            }

        ExerciseUserModel.find({
                    user_id: req.params.user_id,
            }, function(err, data){
            if(err){
                console.log(err);
                res.json(err);
                return;
            }

            if(data.length == 0) {
                console.log("No exercies log found")
                    res.json({
                        message: 'No exercies log found',
                        data: []
                    });            
                }else
            Exercisemodel.find({exercise_id:data._id}, function (err, exerciseModels) {
                   if(err){
                        console.log(err);
                        res.json(err);
                    }   
                    if(exerciseModels.length == 0) {
                    console.log("Exercisemodel record found")
                    res.json({
                        message: 'Exercisemodel record found',
                        data: []
                    });            
                }else
                res.json({
                        message: 'Exercise logs',
                        user:user,
                        exercies: exerciseModels,
                        count: exerciseModels.length
                    });
                });
        })

    });
        
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