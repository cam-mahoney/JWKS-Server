import express from "express"
import { initializeKeys, getActiveKey, getExpiredKey, getValidPublicKeys } from "./keyStore.js"
import { signToken } from "./authService.js"
import { buildJWKS } from "./jwksService.js"

const app = express()

await initializeKeys()

app.get("/.well-known/jwks.json", async (req, res) => {
  const validKeys = getValidPublicKeys()
  const jwks = await buildJWKS(validKeys)
  res.status(200).json(jwks)
})

app.post("/auth", async (req, res) => {
  const useExpired = "expired" in req.query

  const key = useExpired ? getExpiredKey() : getActiveKey()

  const token = await signToken(key, useExpired)

  res.status(200).json({ token })
})

if (process.env.NODE_ENV !== "test") {
  app.listen(8080, () => {
    console.log("Server running on port 8080")
  })
}

export default app
