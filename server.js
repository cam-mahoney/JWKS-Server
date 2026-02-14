import express from "express";
import { initializeKeys, getActiveKey, getExpiredKey, getValidPublicKeys } from "./keyStore.js";
import { signToken } from "./authService.js";
import { buildJWKS } from "./jwksService.js";

const app = express();
app.use(express.json());

await initializeKeys();

// JWKS Endpoint
app.route("/.well-known/jwks.json")
  .get(async (req, res) => {
    const validKeys = getValidPublicKeys();
    const jwks = await buildJWKS(validKeys);
    return res.status(200).json(jwks);
  })
  .all((req, res) => res.sendStatus(405));

// Simple Auth Endpoint (No credential checks)
// server.js
app.route("/auth")
  .post(async (req, res) => {
    try {
    const useExpired = req.query.expired !== undefined;
    let key = useExpired ? getExpiredKey() : getActiveKey();

    // If the server is still warming up, try to get the key one more time
    if (!key) {
      await initializeKeys(); 
      key = useExpired ? getExpiredKey() : getActiveKey();
    }

    // If still no key, return 500 (Server Error), NOT 401 (Unauthorized)
    if (!key) {
      return res.status(500).send("Server is still initializing keys.");
    }

    const token = await signToken(key, useExpired);
    return res.status(200).send(token);
  } catch (err) {
  console.error("Auth error:", err);
  return res.status(500).send("Internal Server Error");
  }
  })
  .all((req, res) => res.sendStatus(405));

app.use((req, res) => res.sendStatus(404));

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}


export default app;