const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subjectCode: { type: String, required: true, unique: true, trim: true },
  subjectName: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  semester: { type: Number, min: 1, max: 8, required: true },
  credits: { type: Number, default: 3 },
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);