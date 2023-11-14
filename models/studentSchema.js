const mongoose = require('mongoose');

// Define the schema for the 'Student' collection.
const studentSchema = new mongoose.Schema(
	{
		// Student name (required).
		name: {
			type: String,
			required: true,
		},
		// Student email should be a unique string (required).
		email: {
			type: String,
			unique: true,
			required: true,
		},
		// Student's college or institution (required).
		college: {
			type: String,
			required: true,
		},
		// Placement status with predefined options (required).
		placement: {
			type: String,
			required: true,
			enum: ['Placed', 'Not Placed'],
		},
		// Contact number of the student (required).
		contactNumber: {
			type: Number,
			required: true,
		},
		// Batch to which the student belongs (required).
		batch: {
			type: String,
			required: true,
		},
		// DSA (Data Structures and Algorithms) score of the student (required).
		dsa: {
			type: Number,
			required: true,
		},
		// Web Development score of the student (required).
		webd: {
			type: Number,
			required: true,
		},
		// React score of the student (required).
		react: {
			type: Number,
			required: true,
		},
		// 'interviews' array contains information about interviews the student has attended.
		interviews: [
			{
				// Company name for the interview.
				company: {
					type: String,
				},
				// Date of the interview (can be stored as a string).
				date: {
					type: String,
				},
				// Result of the interview with predefined options.
				result: {
					type: String,
					enum: ['On Hold', 'Selected', 'Pending', 'Not Selected', 'Did not Attempt'],
				},
			},
		],
	},
	// Enable timestamps for 'createdAt' and 'updatedAt' fields.
	{ timestamps: true }
);

// Create the 'Student' model based on the defined schema.
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
