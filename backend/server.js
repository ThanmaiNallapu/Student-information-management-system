const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes - loaded after app is created
const studentRoutes = require('./routes/students');
const subjectRoutes = require('./routes/subjects');

app.use('/api/students', studentRoutes);
app.use('/api/subjects', subjectRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SIMS Backend Running' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('✅ Connected to MongoDB');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection failed:', err.message);
  process.exit(1);
});

module.exports = app;