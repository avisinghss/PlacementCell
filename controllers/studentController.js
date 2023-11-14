const Company = require('../models/companySchema');
const Student = require('../models/studentSchema');

// Render create student page: Display the 'add_student' view for creating a new student.

module.exports.createStudentPage = async function (req, res) {
	return res.render('add_student');
};

// Create student: Create a new student with the provided details and save it to the database.

module.exports.createStudent = async function (req, res) {
	const { name, email, batch, college, placement, contactNumber, dsa, webd, react } = req.body;
	try {
		const student = await Student.findOne({ email });

		if (student) {
			console.log('Email already exists');
			return res.redirect('back');
		}

		const newStudent = await Student.create({
			name,
			email,
			college,
			batch,
			placement,
			contactNumber,
			dsa,
			webd,
			react,
		});
		await newStudent.save();

		return res.redirect('/');
	} catch (error) {
		console.log(`Error in creating student: ${error}`);
		return res.redirect('back');
	}
};

// Delete student: Delete a student with the specified ID and remove them from any scheduled interviews with companies.

module.exports.deleteStudent = async function (req, res) {
	const { id } = req.params;
	try {
		const student = await Student.findById(id);

		if (student && student.interviews.length > 0) {
			for (let item of student.interviews) {
				const company = await Company.findOne({ name: item.company });
				if (company) {
					for (let i = 0; i < company.students.length; i++) {
						if (company.students[i].student.toString() === id) {
							company.students.splice(i, 1);
							company.save();
							break;
						}
					}
				}
			}
		}
		await Student.findByIdAndDelete(id);
		res.redirect('back');
	} catch (error) {
		console.log('Error in deleting student');
		return res.redirect('back');
	}
};
