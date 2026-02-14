import request from "supertest";
import app from "./server.js";

describe("Project 1 Simple Tests", () => {
  test("GET JWKS works", async () => {
    const res = await request(app).get("/.well-known/jwks.json");
    expect(res.statusCode).toBe(200);
  });

  test("POST /auth works", async () => {
    const res = await request(app).post("/auth");
    expect(res.statusCode).toBe(200);
  });

  test("POST /auth?expired=true works", async () => {
    const res = await request(app).post("/auth?expired=true");
    expect(res.statusCode).toBe(200);
  });

  test("Invalid method returns 405", async () => {
    const res = await request(app).put("/auth");
    expect(res.statusCode).toBe(405);
  });

  test("Unknown route returns 404", async () => {
    const res = await request(app).get("/bad-path");
    expect(res.statusCode).toBe(404);
  });
});