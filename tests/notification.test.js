const request = require("supertest");
const app = require("../server"); // Import your express app instance
const {
  getNotificationsByUserId,
  createAnnouncement,
} = require("../src/controllers/notificationController");

jest.mock("../src/models/notificationModel");
jest.mock("../src/services/notificationService");
jest.mock("../src/models/enrollmentModel");

describe("getNotificationsByUserId", () => {
  it("should return notifications for a specific user", async () => {
    const req = {
      user: { _id: "someUserId" },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await getNotificationsByUserId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });
});

describe("createAnnouncement", () => {
  it("should create an announcement and send it to all users", async () => {
    const req = {
      body: { message: "Test announcement message" },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await createAnnouncement(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Important announcement created successfully",
    });
  });
});
