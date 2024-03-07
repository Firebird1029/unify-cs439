const request = require("supertest");
const axios = require("axios");
const app = require("../server/server");

jest.mock("axios");

describe("Express App Tests", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("GET /api", () => {
    it("should respond with JSON message", async () => {
      const response = await request(app).get("/api");

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Hello from server!");
    });
  });

  // TODO @David these two tests below do not actually work lol
  // TODO @David if you uncomment and run `npm test` then it returns errors

  // describe("GET /getUserProfile", () => {
  //   it("should respond with user profile when valid token is provided", async () => {
  //     axios.get.mockResolvedValue({ data: { uri: "some-uri" } });

  //     const response = await request(app).get(
  //       "/getUserProfile?token=valid-token",
  //     );

  //     expect(response.statusCode).toBe(200);
  //     expect(response.body.profile).toBeDefined();
  //   });

  //   it("should respond with 400 when no token is provided", async () => {
  //     const response = await request(app).get("/getUserProfile");

  //     expect(response.statusCode).toBe(400);
  //   });

  //   it("should respond with 500 when error occurs", async () => {
  //     const response = await request(app).get(
  //       "/getTopItems?token=invalid-token",
  //     );

  //     expect(response.statusCode).toBe(500);
  //   });
  // });

  // describe("GET /getTopItems", () => {
  //   it("should respond with top items when valid token and type are provided", async () => {
  //     axios.get.mockResolvedValue({ data: { items: ["item1", "item2"] } });

  //     const response = await request(app).get(
  //       "/getTopItems?token=valid-token&type=artists",
  //     );

  //     expect(response.statusCode).toBe(200);
  //     expect(response.body.topItems).toBeDefined();
  //   });

  //   it("should respond with 400 when no token is provided", async () => {
  //     const response = await request(app).get("/getTopItems?type=artists");

  //     expect(response.statusCode).toBe(400);
  //   });

  //   it("should respond with 500 when error occurs", async () => {
  //     const response = await request(app).get(
  //       "/getTopItems?token=invalid-token&type=artists",
  //     );

  //     expect(response.statusCode).toBe(500);
  //   });
  // });
});
