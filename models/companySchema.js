const mongoose = require('mongoose');

// Define the schema for the 'Company' collection.
const companySchema = new mongoose.Schema(
	{
		// Company name should be a unique string.
		name: {
			type: String,
			unique: true,
		},
		// 'students' array contains information about students' interviews with the company.
		students: [
			{
				// References the 'Student' collection through ObjectId.
				student: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Student',
				},
				// Date of the interview with the student (required).
				date: {
					type: Date,
					required: true,
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

// Create the 'Company' model based on the defined schema.
const Company = mongoose.model('Company', companySchema);

module.exports = Company;
