# API Unit Tests

This directory contains comprehensive unit tests for the Global TNA Service Request Board API endpoints.

## Test Coverage

### Authentication Tests (`auth.test.js`)

- **POST /api/auth/register**
  - ✅ Register new user successfully
  - ✅ Validate required fields (name, email, password)
  - ✅ Validate password minimum length (6 characters)
  - ✅ Prevent duplicate email registration

- **POST /api/auth/login**
  - ✅ Login with correct credentials
  - ✅ Validate required fields
  - ✅ Reject invalid email
  - ✅ Reject incorrect password
  - ✅ Return valid JWT token

### Jobs Tests (`jobs.test.js`)

- **GET /api/jobs**
  - ✅ Retrieve all jobs
  - ✅ Filter by category
  - ✅ Filter by status
  - ✅ Search by title (case-insensitive)
  - ✅ Search by description
  - ✅ Handle empty results

- **GET /api/jobs/:id**
  - ✅ Retrieve job by ID
  - ✅ Return 404 for non-existent job
  - ✅ Handle invalid ID format

- **POST /api/jobs**
  - ✅ Create job when authenticated
  - ✅ Validate required fields
  - ✅ Require authentication
  - ✅ Reject invalid tokens

- **PATCH /api/jobs/:id**
  - ✅ Update job status
  - ✅ Validate status values
  - ✅ Return 404 for non-existent job
  - ✅ Test all valid status transitions

- **DELETE /api/jobs/:id**
  - ✅ Delete job when authenticated
  - ✅ Require authentication
  - ✅ Return 404 for non-existent job

## Running Tests

### Prerequisites

Ensure MongoDB is running and accessible. By default, tests use the URI from your `.env` file.

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Database

Tests use the MongoDB connection specified in `.env`. If you want to use a separate test database, create a `.env.test` file or modify the setup in `__tests__/setup.js`.

## Test Structure

Each test file follows this pattern:

1. **Setup**: Connect to database, create test data
2. **Tests**: Each test case is isolated with `beforeEach` and `afterEach` hooks
3. **Cleanup**: Clear database and disconnect after all tests

## Adding More Tests

To add tests for new endpoints:

1. Create a new test file in `__tests__/` directory
2. Import `request` from supertest and necessary models
3. Use the existing tests as a template
4. Follow the naming convention: `describe()` for endpoint groups and `it()` for individual tests

## Debugging Tests

Run a single test file:

```bash
npm test -- auth.test.js
```

Run a single test:

```bash
npm test -- --testNamePattern="should register a new user successfully"
```

View detailed output:

```bash
npm test -- --verbose
```

## Notes

- Tests use supertest to make HTTP requests to the app
- Authentication tests create real users with hashed passwords
- Jobs tests use created test users to generate valid JWT tokens
- All tests clean up after themselves (deleteMany)
- Default timeout for tests is 30 seconds (suitable for integration tests)

## Troubleshooting

### Tests timing out

- Ensure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- Increase timeout in jest.config.js if needed

### "Not authorised" errors in job tests

- Verify JWT_SECRET in .env matches between auth and job tests
- Check that tokens are being set in Authorization headers

### Database already exists errors

- Tests automatically clean up, but if stuck, manually delete test data or use a separate test database
