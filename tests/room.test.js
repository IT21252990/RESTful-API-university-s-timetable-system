const request = require("supertest");
const app = require("../server"); // Import your express app instance
const {
  getAllRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../src/controllers/roomController");
const User = require("../src/models/userModel");
const Room = require("../src/models/roomModel");

jest.mock("../src/models/userModel");
jest.mock("../src/models/roomModel");

describe("getAllRooms", () => {
  it("should return all rooms if user is admin", async () => {
    const req = { user: { id: "userId", role: "Admin" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const rooms = [{ name: "Room 1" }, { name: "Room 2" }];

    User.findById.mockResolvedValue({ role: "Admin" });
    Room.find.mockResolvedValue(rooms);

    await getAllRooms(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(rooms);
  });

  it("should return 403 status if user is not admin", async () => {
    const req = { user: { id: "userId", role: "User" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findById.mockResolvedValue({ role: "User" });

    await getAllRooms(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });
});

describe("getRoom", () => {
  it("should return room if user is admin and room exists", async () => {
    const req = { user: { id: "userId", role: "Admin" }, params: { id: "roomId" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const room = { name: "Room 1" };

    User.findById.mockResolvedValue({ role: "Admin" });
    Room.findById.mockResolvedValue(room);

    await getRoom(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(room);
  });

  it("should return 403 status if user is not admin", async () => {
    const req = { user: { id: "userId", role: "User" }, params: { id: "roomId" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findById.mockResolvedValue({ role: "User" });

    await getRoom(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("should return 404 status if room does not exist", async () => {
    const req = { user: { id: "userId", role: "Admin" }, params: { id: "nonExistentRoomId" } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findById.mockResolvedValue({ role: "Admin" });
    Room.findById.mockResolvedValue(null);

    await getRoom(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

// Similar tests can be written for createRoom, updateRoom, and deleteRoom functions
