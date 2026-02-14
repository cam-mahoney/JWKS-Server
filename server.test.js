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

test("GET JWKS works", async () => {
    const res = await request(app).get("/.well-known/jwks.json");
    expect(res.statusCode).toBe(200);
    // Add these to prove you're checking the data
    expect(res.body.keys).toBeDefined();
    expect(res.body.keys[0].kty).toBe("RSA");
  });

  test("POST /auth works", async () => {
    const res = await request(app).post("/auth");
    expect(res.statusCode).toBe(200);
    expect(res.body.jwt).toBeDefined();
  });
  test("JWKS endpoint should return 405 for POST", async () => {
  const res = await request(app).post("/.well-known/jwks.json");
  expect(res.statusCode).toBe(405);
});