const request = require('supertest');
const app = require('../server'); // Replace with your Express app file
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../src/models/userModel');
const Course = require('../src/models/courseModel');

// Creating an in-memory MongoDB database for testing
const mongod = new MongoMemoryServer();

beforeAll(async () => {
  const uri = await mongod.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  await User.create([
    { _id: 'user1', role: 'Admin' }, // Creating a mock admin user
    { _id: 'faculty1', role: 'Faculty' } // Creating a mock faculty user
  ]);
  await Course.create([
    { _id: 'course1', name: 'Course 1', code: 'C001', description: 'Description 1', credits: 3, faculty: 'faculty1' },
    { _id: 'course2', name: 'Course 2', code: 'C002', description: 'Description 2', credits: 4, faculty: 'faculty2' }
  ]);
});

afterEach(async () => {
  await User.deleteMany({});
  await Course.deleteMany({});
});

describe('GET /api/courses/faculty', () => {
  test('should get all courses for faculty', async () => {
    const response = await request(app).get('/api/courses/faculty').set('Authorization', 'Bearer faculty1_token');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Course 1');
  });

  test('should return 404 if no courses found for faculty', async () => {
    const response = await request(app).get('/api/courses/faculty').set('Authorization', 'Bearer faculty2_token');
    expect(response.status).toBe(404);
  });

  test('should return 403 if user is not a faculty member', async () => {
    const response = await request(app).get('/api/courses/faculty').set('Authorization', 'Bearer user1_token');
    expect(response.status).toBe(403);
  });
});
