const {
    getAllBookings,
    getBooking,
    createBooking,
    updateBooking,
    deleteBooking,
} = require("../src/controllers/bookingController"); 

const asyncHandler = require("express-async-handler");
const Bookings = require("../src/models/bookingModel");
const Course = require("../src/models/courseModel");
const Room = require("../src/models/roomModel");
const User = require("../src/models/userModel");

jest.mock("express-async-handler");
jest.mock("../src/models/bookingModel");
jest.mock("../src/models/courseModel");
jest.mock("../src/models/roomModel");
jest.mock("../src/models/userModel");

const mockReq = (overrides = {}) => ({
  user: { id: "mockUserId" },
  params: {},
  body: {},
  ...overrides,
});
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("getAllBookings", () => {
  test("should return all bookings if user is admin", async () => {
    const user = {
      id: "adminUserId",
      role: "Admin",
    };
    const req = { user };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const bookings = [{ id: "booking1" }, { id: "booking2" }];
    User.findById.mockResolvedValue(user);
    Bookings.find.mockResolvedValue(bookings);

    await getAllBookings(req, res);

    expect(User.findById).toHaveBeenCalledWith("adminUserId");
    expect(Bookings.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(bookings);
  });

  test("should return 403 error if user is not admin", async () => {
    const user = {
      id: "regularUserId",
      role: "Regular",
    };
    const req = { user };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findById.mockResolvedValue(user);

    await getAllBookings(req, res);

    expect(User.findById).toHaveBeenCalledWith("regularUserId");
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Only admins can access this route",
    });
  });
});

describe("getAllBookings", () => {
  it("should return all bookings if user is admin", async () => {
    const req = mockReq();
    const res = mockRes();
    User.findById.mockResolvedValue({ role: "Admin" });
    Bookings.find.mockResolvedValue(["booking1", "booking2"]);

    await getAllBookings(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(["booking1", "booking2"]);
  });

  // Add more tests for other scenarios (e.g., user is not admin)
});

describe("getBooking", () => {
  it("should return the booking with the given id if user is admin", async () => {
    const req = mockReq({ params: { id: "bookingId" } });
    const res = mockRes();
    User.findById.mockResolvedValue({ role: "Admin" });
    Bookings.findById.mockResolvedValue("mockedBooking");

    await getBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith("mockedBooking");
  });

  // Add more tests for other scenarios (e.g., user is not admin, booking not found)
});

describe("createBooking", () => {
  it("should create a new booking if user is admin and there is no overlap", async () => {
    const req = mockReq({
      body: {
        room: "roomId",
        startTime: new Date(),
        endTime: new Date(),
        course: "courseId",
      },
    });
    const res = mockRes();
    User.findById.mockResolvedValue({ role: "Admin" });
    Bookings.exists.mockResolvedValue(false);
    Course.exists.mockResolvedValue(true);
    Room.exists.mockResolvedValue(true);
    Bookings.create.mockResolvedValue("createdBooking");

    await createBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith("createdBooking");
  });

  // Add more tests for other scenarios (e.g., user is not admin, overlap exists, course/room not found)
});

describe("updateBooking", () => {
  it("should update the booking with the given id if user is admin and there is no overlap", async () => {
    const req = mockReq({
      params: { id: "bookingId" },
      body: {
        room: "roomId",
        startTime: new Date(),
        endTime: new Date(),
        course: "courseId",
      },
    });
    const res = mockRes();
    User.findById.mockResolvedValue({ role: "Admin" });
    Bookings.findById.mockResolvedValue("existingBooking");
    Bookings.findByIdAndUpdate.mockResolvedValue("updatedBooking");
    Bookings.find.mockResolvedValue([]);

    await updateBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith("updatedBooking");
  });

  // Add more tests for other scenarios (e.g., user is not admin, overlap exists, booking not found)
});

describe("deleteBooking", () => {
  it("should delete the booking with the given id if user is admin", async () => {
    const req = mockReq({ params: { id: "bookingId" } });
    const res = mockRes();
    User.findById.mockResolvedValue({ role: "Admin" });
    Bookings.findById.mockResolvedValue("existingBooking");
    Bookings.deleteOne.mockResolvedValue("deletedBooking");

    await deleteBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith("deletedBooking");
  });
});
