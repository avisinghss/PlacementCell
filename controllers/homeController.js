const Student = require('../models/studentSchema');

// Render home page: Fetch all students from the database using the 'Student' model.
// Render the 'home' view with the student data to be displayed on the page.

module.exports.homePage = async function (req, res) {
  try {
    const students = await Student.find({});
    return res.render('home', { students });
  } catch (error) {
    console.log(`Error rendering home page: ${error}`);
    return res.redirect('back');
  }
};
