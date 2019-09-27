// Import Usermodel model
Usermodel = require('./userModel');
// Handle index actions
exports.index = function (req, res) {
    Usermodel.get(function (err, Usermodels) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Usermodels retrieved successfully",
            data: Usermodels
        });
    });
};
// Handle create Usermodel actions
exports.new = function (req, res) {

    Usermodel.find({name:req.body.name}, function(err, data){
            if(err){
                console.log(err);
                return;
            }

            if(data.length != 0) {
                console.log("Username already exists")
                res.json({
                        message: 'Username already exists!',
                        username: data[0].name,                        
                        _id: data[0]._id
                    });
                return;
            }

            else {

                var usermodel = new Usermodel();
                usermodel.name = req.body.name ? req.body.name : usermodel.name;
            // save the Usermodel and check for errors
                usermodel.save(function (err) {
                    // if (err)
                    //     res.json(err);
                res.json({
                        message: 'New User created!',
                        username: usermodel.name,
                        _id: usermodel._id
                    });
                });
            }
        });
};
// Handle view Usermodel info
exports.view = function (req, res) {
    Usermodel.findById(req.params.user_id, function (err, usermodel) {
        if (err)
            res.send(err);
        res.json({
            message: 'User details',
            data: usermodel
        });
    });
};
// Handle update Usermodel info
exports.update = function (req, res) {

    if(!req.body.name) {
        return res.status(400).send({
            message: "User name can not be empty"
        });
    }

    // Find note and update it with the request body
    Usermodel.findByIdAndUpdate(req.params.user_id, {
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
// Handle delete Usermodel
exports.delete = function (req, res) {

     Usermodel.findByIdAndRemove(req.params.user_id)
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