import express from "express";
import { initializeKeys, getActiveKey, getExpiredKey, getValidPublicKeys } from "./keyStore.js";
import { signToken } from "./authService.js";
import { buildJWKS } from "./jwksService.js";

const app = express();
app.use(express.json());

// Top-level await to ensure keys are ready before the bot connects
await initializeKeys();
console.log("Active:", getActiveKey());
console.log("Expired:", getExpiredKey());

// JWKS Endpoint: Only serve keys that have not expired
app.route("/.well-known/jwks.json")
  .get(async (req, res) => {
    try {
      const validKeys = getValidPublicKeys();
      const jwks = await buildJWKS(validKeys);
      return res.status(200).json(jwks);
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  })
  .all((req, res) => res.sendStatus(405));

// Auth Endpoint: Returns signed JWT (handles expired query)
app.route("/auth")
  .post(async (req, res) => {
    try {
      const useExpired = req.query.expired !== undefined;
      const key = useExpired ? getExpiredKey() : getActiveKey();
      const token = await signToken(key, useExpired);
      return res.status(200).json({ jwt: token });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
  })
  .all((req, res) => res.sendStatus(405));

app.use((req, res) => res.sendStatus(404));

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
}

export default app;