import { generateKeyPair } from "jose";
import { v4 as uuidv4 } from "uuid";

// In-memory storage for simplicity
let keys = [];

export async function initializeKeys() {
  // Create one unexpired key and one expired key
  const active = await createKey(false);
  const expired = await createKey(true);
  keys = [active, expired];
}

async function createKey(isExpired) {
  const { publicKey, privateKey } = await generateKeyPair("RS256");
  const kid = String(Math.floor(Math.random() * 1000000));
  
  const now = Math.floor(Date.now() / 1000);
  // Set expiration: +1 hour for active, -1 hour for expired
  const expiresAt = isExpired ? now - 3600 : now + 3600;

  return {
    kid,
    publicKey,
    privateKey,
    expiresAt
  };
}

export function getActiveKey() {
  const now = Math.floor(Date.now() / 1000);
  return keys.find(k => k.expiresAt > now);
}

export function getExpiredKey() {
  const now = Math.floor(Date.now() / 1000);
  return keys.find(k => k.expiresAt < now);
}

export function getValidPublicKeys() {
  const now = Math.floor(Date.now() / 1000);
  // Rubric requirement: Expired JWK must NOT be found in JWKS
  return keys.filter(k => k.expiresAt > now);
}