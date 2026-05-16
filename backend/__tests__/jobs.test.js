const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../app');
const JobRequest = require('../models/JobRequest');
const User = require('../models/User');

describe('Jobs Endpoints', () => {
  let authToken;
  let userId;
  let testJobId;

  beforeAll(async () => {
    // Create a test user and get auth token
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    authToken = userRes.body.token;
    userId = userRes.body.user.id;
  });

  beforeEach(async () => {
    // Clear jobs collection before each test
    await JobRequest.deleteMany({});

    // Create a test job
    const testJob = new JobRequest({
      title: 'Fix Leaky Faucet',
      description: 'Bathroom faucet is dripping',
      category: 'Plumbing',
      location: 'Downtown',
      contactName: 'John Doe',
      contactEmail: 'john@example.com',
      status: 'Open',
    });
    await testJob.save();
    testJobId = testJob._id;
  });

  afterAll(async () => {
    // Cleanup
    await JobRequest.deleteMany({});
    await User.deleteMany({});
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  });

  describe('GET /api/jobs', () => {
    it('should get all jobs', async () => {
      const res = await request(app).get('/api/jobs');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0]).toHaveProperty('description');
      expect(res.body[0]).toHaveProperty('status');
    });

    it('should filter jobs by category', async () => {
      // Create another job with different category
      const electricalJob = new JobRequest({
        title: 'Install Light Switch',
        description: 'Need to install new light switch',
        category: 'Electrical',
        location: 'Kitchen',
      });
      await electricalJob.save();

      const res = await request(app)
        .get('/api/jobs')
        .query({ category: 'Plumbing' });

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].category).toBe('Plumbing');
    });

    it('should filter jobs by status', async () => {
      // Create a job with different status
      const closedJob = new JobRequest({
        title: 'Paint Wall',
        description: 'Wall painting completed',
        category: 'Painting',
        status: 'Closed',
      });
      await closedJob.save();

      const res = await request(app)
        .get('/api/jobs')
        .query({ status: 'Closed' });

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].status).toBe('Closed');
    });

    it('should search jobs by title', async () => {
      const res = await request(app)
        .get('/api/jobs')
        .query({ search: 'Leaky' });

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].title).toMatch(/Leaky/i);
    });

    it('should search jobs by description', async () => {
      const res = await request(app)
        .get('/api/jobs')
        .query({ search: 'dripping' });

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should return empty array when no jobs match filter', async () => {
      const res = await request(app)
        .get('/api/jobs')
        .query({ category: 'NonExistent' });

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(0);
    });
  });

  describe('GET /api/jobs/:id', () => {
    it('should get a job by id', async () => {
      const res = await request(app).get(`/api/jobs/${testJobId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body._id).toEqual(testJobId.toString());
      expect(res.body.title).toBe('Fix Leaky Faucet');
      expect(res.body.category).toBe('Plumbing');
    });

    it('should return 404 for non-existent job', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/jobs/${fakeId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Job not found');
    });

    it('should return 404 for invalid job id format', async () => {
      const res = await request(app).get('/api/jobs/invalidid');

      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /api/jobs', () => {
    it('should create a new job when authenticated', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Repair Door',
          description: 'Front door needs repair',
          category: 'Joinery',
          location: 'Front entrance',
          contactName: 'Jane Smith',
          contactEmail: 'jane@example.com',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe('Repair Door');
      expect(res.body.status).toBe('Open'); // Default status
    });

    it('should fail when title is missing', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Some description',
          category: 'Plumbing',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Title is required');
    });

    it('should fail when description is missing', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Job Title',
          category: 'Plumbing',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Description is required');
    });

    it('should fail when not authenticated', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .send({
          title: 'Repair Door',
          description: 'Front door needs repair',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain('Not authorised');
    });

    it('should fail with invalid authentication token', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', 'Bearer invalidtoken')
        .send({
          title: 'Repair Door',
          description: 'Front door needs repair',
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('PATCH /api/jobs/:id', () => {
    it('should update job status', async () => {
      const res = await request(app)
        .patch(`/api/jobs/${testJobId}`)
        .send({ status: 'In Progress' });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('In Progress');
      expect(res.body._id).toEqual(testJobId.toString());
    });

    it('should fail with invalid status', async () => {
      const res = await request(app)
        .patch(`/api/jobs/${testJobId}`)
        .send({ status: 'InvalidStatus' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('status must be one of');
    });

    it('should fail if status is missing', async () => {
      const res = await request(app)
        .patch(`/api/jobs/${testJobId}`)
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('status must be one of');
    });

    it('should return 404 for non-existent job', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .patch(`/api/jobs/${fakeId}`)
        .send({ status: 'Closed' });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Job not found');
    });

    it('should accept all valid status values', async () => {
      const validStatuses = ['Open', 'In Progress', 'Closed'];

      for (const status of validStatuses) {
        const res = await request(app)
          .patch(`/api/jobs/${testJobId}`)
          .send({ status });

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(status);
      }
    });
  });

  describe('DELETE /api/jobs/:id', () => {
    it('should delete a job when authenticated', async () => {
      const res = await request(app)
        .delete(`/api/jobs/${testJobId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Job deleted successfully');

      // Verify job is deleted
      const getRes = await request(app).get(`/api/jobs/${testJobId}`);
      expect(getRes.statusCode).toBe(404);
    });

    it('should fail when not authenticated', async () => {
      const res = await request(app).delete(`/api/jobs/${testJobId}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain('Not authorised');
    });

    it('should fail with invalid token', async () => {
      const res = await request(app)
        .delete(`/api/jobs/${testJobId}`)
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.statusCode).toBe(401);
    });

    it('should return 404 for non-existent job', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/jobs/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Job not found');
    });
  });
});
