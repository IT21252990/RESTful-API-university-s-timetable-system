const request = require('supertest');
const app = require('../server'); // Import your Express app instance
const {
  getAllTimetables,
  getTimetable,
  createTimetable,
  updateTimetable,
  deleteTimetable,
  getAllTimetablesByCourse,
} = require('../src/controllers/timeTableController');
const Timetable = require('../src/models/timeTableModel');
const User = require('../src/models/userModel');
const Course = require('../src/models/courseModel');

jest.mock('../src/models/timeTableModel');
jest.mock('../src/models/userModel');
jest.mock('../src/models/courseModel');

describe('getAllTimetables', () => {
  it('should return all timetables', async () => {
    const mockTimetables = [{}, {}]; // Mocked timetables
    Timetable.find.mockResolvedValue(mockTimetables);

    const res = await request(app).get('/api/timetables');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockTimetables);
  });
});

describe('getTimetable', () => {
  it('should return a single timetable', async () => {
    const mockTimetable = {}; // Mocked timetable
    Timetable.findById.mockResolvedValue(mockTimetable);

    const res = await request(app).get('/api/timetables/123');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockTimetable);
  });

  it('should return 404 if timetable not found', async () => {
    Timetable.findById.mockResolvedValue(null);

    const res = await request(app).get('/api/timetables/123');

    expect(res.status).toBe(404);
  });
});

describe('createTimetable', () => {
  // Mocked req.user.id and req.body
  const mockReq = {
    user: { id: 'user-id' },
    body: {
      course: 'course-id',
      dayOfWeek: 'Monday',
      startTime: '09:00',
      endTime: '11:00',
      location: 'Room 101',
    },
  };

  it('should create a new timetable', async () => {
    User.findById.mockResolvedValue({ role: 'Admin' });
    Course.exists.mockResolvedValue(true);
    Timetable.create.mockResolvedValue(mockReq.body);

    const res = await request(app).post('/api/timetables').send(mockReq);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockReq.body);
  });

  it('should return 403 if user is not admin', async () => {
    User.findById.mockResolvedValue({ role: 'Student' });

    const res = await request(app).post('/api/timetables').send(mockReq);

    expect(res.status).toBe(403);
  });

  it('should return 404 if course does not exist', async () => {
    User.findById.mockResolvedValue({ role: 'Admin' });
    Course.exists.mockResolvedValue(false);

    const res = await request(app).post('/api/timetables').send(mockReq);

    expect(res.status).toBe(404);
  });
});

// Similar tests for updateTimetable and deleteTimetable

describe('getAllTimetablesByCourse', () => {
  it('should return all timetables associated with a course', async () => {
    const mockUser = { role: 'Faculty', id: 'faculty-id' };
    const mockCourses = [{ _id: 'course-id-1' }, { _id: 'course-id-2' }];
    const mockTimetables = [{}, {}];

    User.findById.mockResolvedValue(mockUser);
    Course.find.mockResolvedValue(mockCourses);
    Timetable.findOne.mockResolvedValueOnce(mockTimetables[0]).mockResolvedValueOnce(mockTimetables[1]);

    const res = await request(app).get('/api/timetables/courses');

    expect(res.status).toBe(200);
    expect(res.body.timetables).toEqual(mockTimetables);
  });

  it('should return 403 if user is not faculty', async () => {
    User.findById.mockResolvedValue({ role: 'Student' });

    const res = await request(app).get('/api/timetables/courses');

    expect(res.status).toBe(403);
  });

  it('should return 500 if error occurs while fetching timetables', async () => {
    User.findById.mockResolvedValue({ role: 'Faculty', id: 'faculty-id' });
    Course.find.mockRejectedValue(new Error('Database error'));

    const res = await request(app).get('/api/timetables/courses');

    expect(res.status).toBe(500);
  });
});
