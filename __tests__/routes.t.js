const request = require("supertest");

const app = require("../server/server");

describe("Test /api", () => {
  test("GET /api", (done) => {
    request(app)
      .get("/api")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe("Hello from server!");
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});
