import { SignJWT } from "jose";

export async function signToken(key, expired = false) {
  const now = Math.floor(Date.now() / 1000);
  
  // FIX: Convert key.kid to a String 
  return await new SignJWT({ sub: "userABC" }) 
    .setProtectedHeader({ 
      alg: "RS256", 
      kid: String(key.kid) 
    })
    .setIssuedAt(now - 60) 
    .setExpirationTime(expired ? now - 3600 : now + 3600)
    .sign(key.privateKey);
}