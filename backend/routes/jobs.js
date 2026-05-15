const express = require('express');
const router = express.Router();
const JobRequest = require('../models/JobRequest');
const protect = require('../middleware/authMiddleware');

// GET /api/jobs  — supports ?category=, ?status=, ?search=
router.get('/', async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

// GET /api/jobs/:id
router.get('/:id', async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    next(err);
  }
});

// POST /api/jobs  — protected
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, description, category, location, contactName, contactEmail } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!description || !String(description).trim()) {
      return res.status(400).json({ message: 'Description is required' });
    }

    const job = new JobRequest({ title, description, category, location, contactName, contactEmail });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/jobs/:id  — updates status only
router.patch('/:id', async (req, res, next) => {
  try {
    const { status } = req.body;
    const valid = ['Open', 'In Progress', 'Closed'];

    if (!status || !valid.includes(status)) {
      return res.status(400).json({ message: 'status must be one of: Open, In Progress, Closed' });
    }

    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/jobs/:id  — protected
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const job = await JobRequest.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
