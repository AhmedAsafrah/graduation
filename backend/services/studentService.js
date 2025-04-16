const StudentModel = require("../models/studentModel");

exports.createStudent = async (req, res) => {
  const { name, email, password, phoneNumber, college } = req.body;

  const student = new StudentModel({
    name,
    email,
    password,
    phoneNumber,
    college,
  });

  try {
    const savedStudent = await student.save();
    res.status(201).json({
        status: "success",
        message: "Student created successfully",
        student: savedStudent,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
