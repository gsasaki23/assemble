// Adjust port and mongo db with these helper variables
const port = 8000;
const db_name = "assembly";

// Import and activate express
const express = require('express');
const app = express();
app.use(express.json());
// Allow use of POST requests
app.use(express.urlencoded({ extended: true }));

// Import and activate cors
const cors = require('cors')
app.use(cors())

// Import configs with db name
require("./config/mongoose.config")(db_name);
// Import routes function and execute
require('./routes/assembly.routes')(app);

// Helper print to make sure port was activated
const server = app.listen(port, () => console.log(`Server is listening on port ${port}`));

// Import socket
const io = require("socket.io")(server);

let test = 0;

io.on("connection", socket => {
    // Will log every time a new user logs on
    console.log(socket.id);

    // emit test when client initially connects
    socket.emit("test updated", test);

    // When any socket tells server to increment
    socket.on("increment", newTest => {
        // Override the test obj
        test = newTest;
        // Emit updated test
        io.emit("test updated", test);
    });
});