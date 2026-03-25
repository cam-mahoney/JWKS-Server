import express from "express";
import { initializeKeys, getActiveKey, getExpiredKey, getValidPublicKeys } from "./keyStore.js";
import { signToken } from "./authService.js";

const app = express();
app.use(express.json());

await initializeKeys();

// JWKS Endpoint: Only serve keys that have not expired
app.get("/.well-known/jwks.json", async (req, res) => {
  try {
    const validKeys = await getValidPublicKeys();
    res.json({ keys: validKeys }); 
  } catch (err) {
    console.error("JWKS Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Auth Endpoint: Returns signed JWT (handles expired query)
app.route("/auth")
  .post(async (req, res) => {
    try {
      const useExpired = req.query.expired !== undefined;
      const key = useExpired ? await getExpiredKey() : await getActiveKey();      const token = await signToken(key, useExpired);
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