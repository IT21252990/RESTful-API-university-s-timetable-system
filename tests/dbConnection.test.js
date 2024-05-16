const mongoose = require('mongoose');
const connectDB = require('../src/config/dbConnection');

console.log = jest.fn();

process.exit = jest.fn();

describe('connectDB', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should connect to the database successfully', async () => {
    mongoose.connect = jest.fn().mockResolvedValue({
      connection: {
        name: 'testDB',
      },
    });

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.DATABASE_CONNECTION_STRING);

    expect(console.log).toHaveBeenCalledWith('Connected to DB', 'testDB');
  });

  test('should exit process if connection fails', async () => {
    mongoose.connect = jest.fn().mockRejectedValue(new Error('Connection failed'));

    await connectDB();

    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
