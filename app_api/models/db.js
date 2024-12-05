var mongoose = require('mongoose');

// const dbURI = "mongodb://localhost/mekanbul"; 
const dbURI = process.env.MONGODB_URI;

var venue = require('./venue');

mongoose.connect(dbURI);

var connected = () => {
    console.log("Database is connected");
    // logCollections();
}
var disconnected = () => {console.log("Database is disconnected");}

process.on("SIGINT", () => {
    mongoose.connection.close();
    console.log("Ctrl + C is pressed, closing connection.");
    process.exit(0);
});

mongoose.connection.on("connected", connected);
mongoose.connection.on("disconnected", disconnected);