const {
    getAllEnrollment,
    getEnrollment,
    createEnrollment,
    deleteEnrollment,
    getAllEnrollmentByStudent,
    getAllTimetablesByStudentEnrolled
  } = require('../src/controllers/enrollmentController');
  
  const Enrollment = require("../src/models/enrollmentModel");
  const User = require("../src/models/userModel");
  const Course = require("../src/models/courseModel");
  const TimeTable = require("../src/models/timeTableModel");
  
  jest.mock('../src/models/enrollmentModel');
  jest.mock('../src/models/userModel');
  jest.mock('../src/models/courseModel');
  jest.mock('../src/models/timeTableModel');
  
  describe('getAllEnrollment', () => {
    it('should return all enrollments', async () => {
      const mockEnrollments = [{ id: 1, student: '123', course: '456' }];
      Enrollment.find.mockResolvedValue(mockEnrollments);
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      await getAllEnrollment(req, res);
  
      expect(Enrollment.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEnrollments);
    });
  });
  
  describe('getEnrollment', () => {
    it('should return a single enrollment', async () => {
      const mockEnrollment = { id: 1, student: '123', course: '456' };
      Enrollment.findById.mockResolvedValue(mockEnrollment);
      const req = { params: { id: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      await getEnrollment(req, res);
  
      expect(Enrollment.findById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEnrollment);
    });
  
    it('should return 404 if enrollment is not found', async () => {
      Enrollment.findById.mockResolvedValue(null);
      const req = { params: { id: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      await getEnrollment(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Enrollment not found' });
    });
  });
  
  describe('createEnrollment', () => {
    it('should create a new enrollment', async () => {
      const mockUser = { id: '123', role: 'Student' };
      const mockReqBody = { course: '456' };
      const mockEnrollment = { id: 1, student: '123', course: '456' };
      const mockCreatedEnrollment = { ...mockEnrollment, save: jest.fn() };
      User.findById.mockResolvedValue(mockUser);
      Course.exists.mockResolvedValue(true);
      Enrollment.create.mockResolvedValue(mockCreatedEnrollment);
      const req = { user: { id: '123' }, body: mockReqBody };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      await createEnrollment(req, res);
  
      expect(Enrollment.create).toHaveBeenCalledWith({
        student: '123',
        course: '456'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedEnrollment);
    });
  
  });