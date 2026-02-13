import { generateKeyPair } from "jose"
import { v4 as uuidv4 } from "uuid"

let keys = []

export async function initializeKeys() {
  const active = await createKey(false)
  const expired = await createKey(true)
  keys = [active, expired]
}

async function createKey(expired) {
  const { publicKey, privateKey } = await generateKeyPair("RS256")

  const kid = uuidv4()

  const expiresAt = expired
    ? Date.now() - 60 * 60 * 1000
    : Date.now() + 60 * 60 * 1000

  return {
    kid,
    publicKey,
    privateKey,
    expiresAt
  }
}

export function getActiveKey() {
  return keys.find(k => k.expiresAt > Date.now())
}

export function getExpiredKey() {
  return keys.find(k => k.expiresAt < Date.now())
}

export function getValidPublicKeys() {
  return keys.filter(k => k.expiresAt > Date.now())
}

export function getAllKeys() {
  return keys
}
