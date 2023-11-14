const Student = require('../models/studentSchema');
const Company = require('../models/companySchema');

// Render company page: This function retrieves all students from the database using the 'Student' model and renders the 'company' view. The student data is passed to the view, allowing the display of student information on the page.

module.exports.companyPage = async function (req, res) {
  try {
    const students = await Student.find({});
    return res.render('company', { students }); // Render the 'company' view and pass the student data to be displayed
  } catch (error) {
    console.log(`Error rendering company page: ${error}`);
    return res.redirect('back'); // In case of an error, redirect the user back to the previous page
  }
};

// Allocate interview: This function fetches all students from the database using the 'Student' model and extracts unique batches from them. It then renders the 'allocateInterview' view, providing both the student data and the unique batches. This allows the user to allocate interviews based on different student batches.

module.exports.allocateInterview = async function (req, res) {
  try {
    const students = await Student.find({});
    const uniqueBatches = [...new Set(students.map(student => student.batch))]; // Get unique batches from student data
    return res.render('allocateInterview', { students, uniqueBatches }); // Render the 'allocateInterview' view and pass the student data and unique batches to be displayed
  } catch (error) {
    console.log(`Error allocating interviews: ${error}`);
    return res.redirect('back'); // In case of an error, redirect the user back to the previous page
  }
};

// Schedule interview: This function handles the scheduling of interviews for students with a specific company. It takes the student ID, company name, and interview date from the request body. The function checks if the company exists in the database using the 'Company' model. If not, it creates a new company entry. The function then updates the interview details for both the student and the company, setting the result as 'Pending'.

module.exports.scheduleInterview = async function (req, res) {
  const { id, company, date } = req.body;
  try {
    const existingCompany = await Company.findOne({ name: company });

    const interviewDetails = { student: id, date, result: 'Pending' };

    if (!existingCompany) {
      // If the company does not exist, create a new company entry
      const newCompany = await Company.create({
        name: company
      });
      newCompany.students.push(interviewDetails);
      newCompany.save();
    } else {
      for (let student of existingCompany.students) {
        // Check if the student ID already exists for the company to avoid duplicate scheduling
        if (student.student._id === id) {
          console.log('Interview with this student already scheduled');
          return res.redirect('back');
        }
      }
      existingCompany.students.push(interviewDetails);
      existingCompany.save();
    }

    const student = await Student.findById(id);
    if (student) {
      student.interviews.push(interviewDetails);
      student.save();
    }

    console.log('Interview Scheduled Successfully');
    return res.redirect('/company/home'); // Redirect the user to the company home page after successful scheduling
  } catch (error) {
    console.log(`Error scheduling interview: ${error}`);
    return res.redirect('back'); // In case of an error, redirect the user back to the previous page
  }
};

// Update status of interview: This function handles the update of interview status for a specific student with a particular company. It takes the student ID from the request params and the company name and interview result from the request body. The function searches for the student and updates the interview result for the specified company in both the student and company documents.

module.exports.updateStatus = async function (req, res) {
  const { id } = req.params;
  const { companyName, companyResult } = req.body;
  try {
    const student = await Student.findById(id);
    if (student && student.interviews.length > 0) {
      for (let company of student.interviews) {
        // Check if the company name matches the one provided in the request body and update the result
        if (company.company === companyName) {
          company.result = companyResult;
          student.save();
          break;
        }
      }
    }

    const company = await Company.findOne({ name: companyName });
    if (company) {
      for (let std of company.students) {
        // Check if the student ID matches the one provided in the request params and update the result
        if (std.student.toString() === id) {
          std.result = companyResult;
          company.save();
        }
      }
    }

    console.log('Interview Status Changed Successfully');
    return res.redirect('back'); // Redirect the user back to the previous page after successful status update
  } catch (error) {
    console.log(`Error updating interview status: ${error}`);
    res.redirect('back'); // In case of an error, redirect the user back to the previous page
  }
};
