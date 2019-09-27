// FileName: index.js
// Import express
let express = require('express')
// Initialize the app
let app = express();
// Setup server port
var port = process.env.PORT || 8080;
// Send message for default URL
app.get('/', (req, res) => res.send('server is running'));
// Launch app to listen to specified port
app.listen(port, function () {
     console.log("Running userstories server on port " + port);
});

// Import routes
let apiRoutes = require("./api-routes")
// Use Api routes in the App
app.use('/api', apiRoutes)