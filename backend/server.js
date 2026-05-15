require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const jobsRouter = require('./routes/jobs');
const authRouter = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  })
);
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/jobs', jobsRouter);

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
