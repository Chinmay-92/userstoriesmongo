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
        Exercisemodel.find({
                    user_id: user._id,
            }, function(err, data){
            if(err){
                res.json({
                    success: false,
                    message: error,
                });
                return;
            }

            array = data;
            let exercisemodel = new Exercisemodel();
            if (array.filter(function(e) { return e.description === req.body.description; }).length > 0) {
                res.status(400).send({            
                    success: false,
                    message: 'Unable to create exercise, duplicate exercise with the same name'});
                return;
            }
            exercisemodel.user_id = req.body.user_id;
            exercisemodel.description = req.body.description;
            exercisemodel.duration = req.body.duration;
            if (req.body.date){
                exercisemodel.start_date = new Date(req.body.date);
            }
            else{
                exercisemodel.start_date = new Date();
            }

            exercisemodel.save(function (err,exercise) {
                if (err){
                    res.json(err);
                    return;
                }

                ExerciseUserModel.create({
                                    exercise_id: exercise._id,
                                    user_id: req.body.user_id
                                })
                res.json({
                    success: true,
                    message: "New Exercise created for the user "+user.username+"!",
                    data: exercise
                });
            });

        })
}
// Handle create Exercisemodel actions
exports.new = function (req, res) {
        if(!req.body.user_id) {
        return res.status(400).send({
            success: false,
            message: "UserId can not be empty"
        });
        }
        if(!req.body.description) {
        return res.status(400).send({
            success: false,
            message: "Exercise description can not be empty"
        });
        }
        if(!req.body.duration) {
        return res.status(400).send({
            success: false,
            message: "Exercise duration can not be empty"
        });
        }



        Usermodel.findById(req.body.user_id, function(err,userModel) {
            if (err){
                res.json(err);
                return;
            }

            let user = userModel;
            let array;
            if(user == null)
            {
                res.json({
                    success: false,
                    status: "error",
                    message: "UserId does not exist",
                });
                return;
            }
            array = exports.getExerciseByUserId(user, req, res);                
        });

}
// Handle view Exercisemodel info
exports.view = function (req, res) {

    let from = req.params.from;
    let to = req.params.to;
    let limit = req.params.limit;
    Usermodel.findById(req.params.user_id, function(err,userModel) {
            if (err){
                res.json(err);
                return;
            }

            let user = userModel;
            let array;
            if(user === undefined)
            {
                res.status(400).send({
                    status: "error",
                    message: "UserId is invalid",
                });
                return;
            }else
        ExerciseUserModel.find({
                    user_id: req.params.user_id,
            }, function(err, data){
            if(err){
                res.json(err);
                return;
            }

            if(data.length == 0) {
                    res.json({
                        message: 'No exercies log found',
                        data: []
                    });            
                }else{
                    if(from !== undefined && to !== undefined){                        
                        Exercisemodel.find({exercise_id:data._id,user_id:req.params.user_id,
                        start_date: {$gt: new Date(from), $lt: new Date(to)}
                        }, function (err, exerciseModels) {
                           if(err){
                                res.json(err);
                                return;
                            }   
                            if(exerciseModels.length == 0) {
                            res.json({
                                message: 'Exercises not found',
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
                        return;

                    }else if(limit !== undefined){
                        Exercisemodel.find({exercise_id:data._id,user_id:req.params.user_id}, function (err, exerciseModels) {
                           if(err){
                                res.json(err);
                                return;
                            }   
                            if(exerciseModels.length == 0) {
                            res.json({
                                message: 'Exercises not found',
                                data: []
                            });
                            return;            
                        }else{
                                var exerciseModelsItems = exerciseModels.slice(0, limit);
                                res.json({
                                    message: 'Exercise logs',
                                    user:user,
                                    exercies: exerciseModelsItems,
                                    count: exerciseModels.length
                                });
                                return;
                            }
                        });
                    }else{
                        Exercisemodel.find({exercise_id:data._id,user_id:req.params.user_id}, function (err, exerciseModels) {
                           if(err){
                                res.json(err);
                                return;
                            }   
                            if(exerciseModels.length == 0) {
                            res.json({
                                message: 'Exercises not found',
                                data: []
                            });   
                            return;         
                        }else
                        res.json({
                                message: 'Exercise logs',
                                user:user,
                                exercies: exerciseModels,
                                count: exerciseModels.length
                            });
                        });
                        }

                }
                
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