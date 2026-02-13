import request from "supertest"
import app from "./server.js"
import { decodeProtectedHeader, jwtVerify } from "jose"
import { getActiveKey } from "./keyStore.js"

describe("JWKS Server", () => {

  test("GET /jwks returns only active key", async () => {
    const res = await request(app).get("/jwks")
    expect(res.statusCode).toBe(200)
    expect(res.body.keys.length).toBe(1)
  })

  test("POST /auth returns valid token", async () => {
    const res = await request(app).post("/auth")
    expect(res.statusCode).toBe(200)
    expect(res.body.token).toBeDefined()

    const header = decodeProtectedHeader(res.body.token)
    expect(header.kid).toBeDefined()
  })

  test("POST /auth?expired=true returns expired token", async () => {
    const res = await request(app).post("/auth?expired=true")
    expect(res.statusCode).toBe(200)

    const token = res.body.token
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString()
    )

    expect(payload.exp).toBeLessThan(Math.floor(Date.now() / 1000))
  })

  test("Valid token verifies with active public key", async () => {
    const res = await request(app).post("/auth")
    const token = res.body.token

    const activeKey = getActiveKey()

    await jwtVerify(token, activeKey.publicKey)
  })

})
