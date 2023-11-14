const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema for the 'User' collection.
const userSchema = new mongoose.Schema(
	{
		// User's name (required).
		name: {
			type: String,
			required: true,
		},
		// User's email should be a unique string (required).
		email: {
			type: String,
			unique: true,
			required: true,
		},
		// Hashed password (required).
		passwordHash: {
			type: String,
			required: true,
		},
	},
	// Enable timestamps for 'createdAt' and 'updatedAt' fields.
	{ timestamps: true }
);

// Create a virtual property to set the hashed password.
userSchema.virtual('password').set(function (value) {
	this.passwordHash = bcrypt.hashSync(value, 12);
});

// Function to compare hashed password.
userSchema.methods.isPasswordCorrect = function (password) {
	return bcrypt.compareSync(password, this.passwordHash);
};

// Create the 'User' model based on the defined schema.
const User = mongoose.model('User', userSchema);

module.exports = User;
