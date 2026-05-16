const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");

describe("Auth Endpoints", () => {
  beforeEach(async () => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Clear database
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Close MongoDB connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toMatchObject({
        name: "John Doe",
        email: "john@example.com",
      });
    });

    it("should fail if name, email, or password is missing", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        // password missing
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Name, email and password are required");
    });

    it("should fail if password is less than 6 characters", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        password: "123",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Password must be at least 6 characters");
    });

    it("should fail if email is already registered", async () => {
      // Register first user
      await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });

      // Try to register with same email
      const res = await request(app).post("/api/auth/register").send({
        name: "Jane Doe",
        email: "john@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(409);
      expect(res.body.message).toBe("Email already registered");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Create a test user before login tests
      await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
    });

    it("should login user with correct credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toMatchObject({
        email: "test@example.com",
        name: "Test User",
      });
    });

    it("should fail if email or password is missing", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        // password missing
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Email and password are required");
    });

    it("should fail with invalid email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Invalid email or password");
    });

    it("should fail with incorrect password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Invalid email or password");
    });

    it("should return a valid JWT token", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeTruthy();
      // Token should be a valid JWT (three parts separated by dots)
      expect(res.body.token.split(".")).toHaveLength(3);
    });
  });
});
