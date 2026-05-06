const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');

router.get('/', async (req, res) => {
  try {
    const { department, semester } = req.query;
    let query = {};
    if (department) query.department = department;
    if (semester) query.semester = parseInt(semester);
    const subjects = await Subject.find(query).sort({ semester: 1 });
    res.json({ success: true, data: subjects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json({ success: true, data: subject });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;