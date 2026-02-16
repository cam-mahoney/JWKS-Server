import { SignJWT } from "jose";

// authService.js
export async function signToken(key, expired = false) {
  const now = Math.floor(Date.now() / 1000);
  return await new SignJWT({ sub: "userABC" }) 
    .setProtectedHeader({ alg: "RS256", kid: key.kid })
    .setIssuedAt(now - 60) // Buffer for clock drift
    .setExpirationTime(expired ? now - 3600 : now + 3600)
    .sign(key.privateKey);
}