const request = require('supertest');
const { registerUser, loginUser, currentuser } = require('../src/controllers/userController'); // Update with the correct path

// Mocking dependencies
jest.mock('../src/models/userModel', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));
jest.mock('../src/models/notificationModel', () => ({
  createNotification: jest.fn(),
}));
jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('fakeAccessToken'),
}));

// Mock req, res, next objects
const mockRequest = () => {
  const req = {};
  req.body = jest.fn();
  req.user = { id: 'user_id' }; // Assuming a user id for testing
  return req;
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Register User Route', () => {
  test('should create user successfully', async () => {
    // Mock bcrypt hash function
    bcrypt.hash = jest.fn().mockResolvedValue('mockedHashedPassword');
  
    const createdUser = {
      _id: '123', // Update this value to match the actual _id returned by the function
      email: 'test@example.com',
      // Add other properties as needed
    };
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue(createdUser);
    await registerUser(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ _id: '123', email: 'test@example.com' }); // Update this line as well
  });

  it('should handle invalid email format', async () => {
    const req = mockRequest();
    req.body = { username: 'testUser', password: 'Test1234', email: 'invalidEmail', role: 'user' };
    const res = mockResponse();

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email format' });
  });

  // More test cases can be added for edge cases like missing fields, existing user, etc.
});

describe('Login User Route', () => {
  it('should login a user with correct credentials', async () => {
    const req = mockRequest();
    req.body = { email: 'test@example.com', password: 'Test1234' };
    const res = mockResponse();

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ accessToken: 'fakeAccessToken' });
  });

  it('should handle invalid credentials', async () => {
    const req = mockRequest();
    req.body = { email: 'test@example.com', password: 'wrongPassword' };
    const res = mockResponse();

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  // More test cases can be added for edge cases like missing fields, etc.
});

describe('Current User Route', () => {
  it('should return current user details', async () => {
    const req = mockRequest();
    const res = mockResponse();

    require('../src/models/userModel').findById = jest.fn().mockResolvedValue({ username: 'testUser', email: 'test@example.com' });

    await currentuser(req, res);

    expect(res.json).toHaveBeenCalledWith({ username: 'testUser', email: 'test@example.com' });
  });

  // More test cases can be added for edge cases
});
