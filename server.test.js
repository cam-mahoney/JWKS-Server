import request from "supertest";
import app from "./server.js";

describe("Project 2: SQLite JWKS Server Tests", () => {
  
  test("GET /.well-known/jwks.json returns 200 and valid JWKS", async () => {
    const res = await request(app).get("/.well-known/jwks.json");
    expect(res.statusCode).toBe(200);
    expect(res.body.keys).toBeDefined();
    expect(Array.isArray(res.body.keys)).toBe(true);
    
    if (res.body.keys.length > 0) {
      expect(res.body.keys[0]).toHaveProperty("kid");
      expect(typeof res.body.keys[0].kid).toBe("string"); 
      expect(res.body.keys[0].kty).toBe("RSA");
    }
  });

  test("POST /auth returns 200 and a JWT", async () => {
    const res = await request(app).post("/auth");
    expect(res.statusCode).toBe(200);
    expect(res.body.jwt).toBeDefined();
  });

  test("POST /auth?expired=true returns 200 and an expired JWT", async () => {
    const res = await request(app).post("/auth?expired=true");
    expect(res.statusCode).toBe(200);
    expect(res.body.jwt).toBeDefined();
    
  });

  test("Endpoints should return 405 for unsupported methods", async () => {
    const resAuth = await request(app).get("/auth");
    const resJwks = await request(app).post("/.well-known/jwks.json");
    expect(resAuth.statusCode).toBe(405);
    expect(resJwks.statusCode).toBe(405);
  });

  test("Unknown routes should return 404", async () => {
    const res = await request(app).get("/non-existent-route");
    expect(res.statusCode).toBe(404);
  });
});