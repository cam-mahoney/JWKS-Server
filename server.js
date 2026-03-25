import express from "express";
import { initializeKeys, getActiveKey, getExpiredKey, getValidPublicKeys } from "./keyStore.js";
import { signToken } from "./authService.js";

const app = express();
app.use(express.json());

// Initialize the SQLite database before the server starts
await initializeKeys();

// JWKS Endpoint
app.route("/.well-known/jwks.json")
  .get(async (req, res) => {
    try {
      const validKeys = await getValidPublicKeys();
      res.json({ keys: validKeys }); 
    } catch (err) {
      console.error("JWKS Error:", err);
      res.status(500).send("Internal Server Error");
    }
  })
  .all((req, res) => res.status(405).send("Method Not Allowed"));

// Auth Endpoint
app.route("/auth")
  .post(async (req, res) => {
    try {
      const isExpired = req.query.expired === 'true';
      // Fetch the appropriate key from SQLite
      const key = isExpired ? await getExpiredKey() : await getActiveKey();
      
      if (!key) {
        return res.status(500).json({ error: "No suitable key found in database" });
      }

      const token = await signToken(key, isExpired);
      res.json({ jwt: token });
    } catch (err) {
      console.error("Auth Error:", err);
      res.status(500).send("Internal Server Error");
    }
  })
  .all((req, res) => res.status(405).send("Method Not Allowed"));

// 404 Handler for unknown routes
app.use((req, res) => res.sendStatus(404));

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;