const mongoose = require('mongoose');
const DB = 'mongodb+srv://anubhavsinghrr:Jrk68luFE7y0jpDb@cluster0.gt1zeio.mongodb.net/?retryWrites=true&w=majority';

// Connect mongoose to the database.
mongoose.connect(DB, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;

// Error handling for MongoDB connection.
db.on('error', console.error.bind(console, 'Error in connecting to MongoDB'));

// Once the connection is open, log the success message.
db.once('open', function () {
	console.log('Connected to Database :: Mongodb');
});

module.exports = mongoose;
