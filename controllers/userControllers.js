const User = require('../models/userSchema');
const Student = require('../models/studentSchema');
const fs = require('fs');
const fastcsv = require('fast-csv');

// Render sign up page: Display the 'signup' view for user registration if the user is not authenticated.
module.exports.signup = function (req, res) {
	if (req.isAuthenticated()) return res.redirect('back');
	res.render('signup');
};

// Render sign in page: Display the 'signin' view for user login if the user is not authenticated.
module.exports.signin = function (req, res) {
	if (req.isAuthenticated()) return res.redirect('back');
	res.render('signin');
};

// Create session: Redirect the user to the homepage after successfully creating the session.
module.exports.createSession = function (req, res) {
	console.log('Session created successfully');
	return res.redirect('/');
};

// Sign out: Log out the user and redirect to the sign-in page.
module.exports.signout = function (req, res) {
	req.logout(function (err) {
		if (err) return next(err);
	});
	return res.redirect('/users/signin');
};

// Create user: Validate and create a new user account based on the provided details.
module.exports.createUser = async function (req, res) {
	const { name, email, password, confirmPassword } = req.body;
	try {
		if (password !== confirmPassword) {
			console.log(`Passwords don't match`);
			return res.redirect('back');
		}
		const user = await User.findOne({ email });

		if (user) {
			console.log(`Email already exists`);
			return res.redirect('back');
		}

		const newUser = await User.create({
			name,
			email,
			password,
		});

		await newUser.save();

		if (!newUser) {
			console.log(`Error creating user`);
			return res.redirect('back');
		}

		return res.redirect('/users/signin');
	} catch (error) {
		console.log(`Error creating user: ${error}`);
		res.redirect('back');
	}
};

// Download report: Generate and download a CSV report containing student data, including their interviews if available.
module.exports.downloadCsv = async function (req, res) {
	try {
		const students = await Student.find({});
		let data = '';
		let no = 1;
		let csv = 'S.No, Name, Email, College, Placemnt, Contact Number, Batch, DSA Score, WebDev Score, React Score, Interview, Date, Result';

		for (let student of students) {
			data =
				no +
				',' +
				student.name +
				',' +
				student.email +
				',' +
				student.college +
				',' +
				student.placement +
				',' +
				student.contactNumber +
				',' +
				student.batch +
				',' +
				student.dsa +
				',' +
				student.webd +
				',' +
				student.react;

			if (student.interviews.length > 0) {
				for (let interview of student.interviews) {
					data += ',' + interview.company + ',' + interview.date.toString() + ',' + interview.result;
				}
			}
			no++;
			csv += '\n' + data;
		}

		const dataFile = fs.writeFile('report/data.csv', csv, function (error, data) {
			if (error) {
				console.log(error);
				return res.redirect('back');
			}
			console.log('Report generated successfully');
			return res.download('report/data.csv');
		});
	} catch (error) {
		console.log(`Error downloading file: ${error}`);
		return res.redirect('back');
	}
};
