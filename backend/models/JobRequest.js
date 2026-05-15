const mongoose = require('mongoose');

const jobRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  category: {
    type: String,
    enum: ['Plumbing', 'Electrical', 'Painting', 'Joinery', 'Other'],
  },
  location: {
    type: String,
    trim: true,
  },
  contactName: {
    type: String,
    trim: true,
  },
  contactEmail: {
    type: String,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Closed'],
    default: 'Open',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('JobRequest', jobRequestSchema);
