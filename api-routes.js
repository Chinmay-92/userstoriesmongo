// Filename: api-routes.js
// Initialize express router
let router = require('express').Router();
// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: '200',
        message: 'default API!'
    });
});

var userController = require('./userController');
var exerciseController = require('./exerciseController');
var exerciseUserController = require('./exerciseUserController');


// user routes
router.route('/users')
    .get(userController.index)
    .post(userController.new);

router.route('/users/:user_id')
    .get(userController.view)
    .patch(userController.update)
    .put(userController.update)
    .delete(userController.delete);

router.route('/exercises')
    .get(exerciseController.index)

router.route('/exercise/add').post(exerciseController.new);

router.route('/exercise/log/:user_id').get(exerciseController.view);

router.route('/exerciseusers')
    .get(exerciseUserController.index)

// Export API routes
module.exports = router;