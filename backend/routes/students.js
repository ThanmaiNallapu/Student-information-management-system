const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET all students with search & filter
router.get('/', async (req, res) => {
  try {
    const { search, department, semester, status, page = 1, limit = 10 } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (department) query.department = department;
    if (semester) query.semester = parseInt(semester);
    if (status) query.status = status;

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, data: students, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET dashboard stats
router.get('/stats/dashboard', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: 'Active' });
    const departmentStats = await Student.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const semesterStats = await Student.aggregate([
      { $group: { _id: '$semester', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    const avgCgpa = await Student.aggregate([
      { $group: { _id: null, avg: { $avg: '$cgpa' } } },
    ]);
    res.json({
      success: true,
      data: {
        totalStudents,
        activeStudents,
        inactiveStudents: totalStudents - activeStudents,
        departmentStats,
        semesterStats,
        avgCgpa: avgCgpa[0]?.avg?.toFixed(2) || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single student
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create student
router.post('/', async (req, res) => {
  try {
    const body = { ...req.body };
    body.semester = parseInt(body.semester);
    if (!body.dateOfBirth) delete body.dateOfBirth;
    if (!body.enrollmentDate) delete body.enrollmentDate;
    if (!body.gender) delete body.gender;

    const student = new Student(body);
    await student.save();
    res.status(201).json({ success: true, data: student, message: 'Student created successfully' });
  } catch (err) {
    console.log('ERROR:', err.message);
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ success: false, message: `${field} already exists` });
    }
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update student
router.put('/:id', async (req, res) => {
  try {
    const body = { ...req.body };
    body.semester = parseInt(body.semester);
    if (!body.dateOfBirth) delete body.dateOfBirth;
    if (!body.enrollmentDate) delete body.enrollmentDate;
    if (!body.gender) delete body.gender;

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    Object.assign(student, body);
    await student.save();
    res.json({ success: true, data: student, message: 'Student updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

