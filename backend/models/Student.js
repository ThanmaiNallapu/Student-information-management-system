const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  internal: { type: Number, min: 0, max: 30, default: 0 },
  external: { type: Number, min: 0, max: 70, default: 0 },
  total: { type: Number, default: 0 },
  grade: { type: String, default: 'F' },
});

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true, trim: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  department: { type: String, required: true, trim: true },
  semester: { type: Number, min: 1, max: 8, required: true },
  section: { type: String, trim: true },
  address: { type: String, trim: true },
  enrollmentDate: { type: Date },
  marks: [markSchema],
  cgpa: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Inactive', 'Graduated'], default: 'Active' },
}, { timestamps: true });

studentSchema.pre('save', async function () {
  if (this.marks && this.marks.length > 0) {
    let totalPoints = 0;
    this.marks.forEach((mark) => {
      mark.total = mark.internal + mark.external;
      if (mark.total >= 90) mark.grade = 'O';
      else if (mark.total >= 80) mark.grade = 'A+';
      else if (mark.total >= 70) mark.grade = 'A';
      else if (mark.total >= 60) mark.grade = 'B+';
      else if (mark.total >= 50) mark.grade = 'B';
      else if (mark.total >= 40) mark.grade = 'C';
      else mark.grade = 'F';
      const gradeMap = { O: 10, 'A+': 9, A: 8, 'B+': 7, B: 6, C: 5, F: 0 };
      totalPoints += gradeMap[mark.grade] || 0;
    });
    this.cgpa = parseFloat((totalPoints / this.marks.length).toFixed(2));
  }
});
module.exports = mongoose.model('Student', studentSchema);
