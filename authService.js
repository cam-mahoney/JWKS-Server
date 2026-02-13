import { SignJWT } from "jose"

export async function signToken(key, expired = false) {
  const now = Math.floor(Date.now() / 1000)

  return await new SignJWT({ sub: "fakeUser" })
    .setProtectedHeader({
      alg: "RS256",
      kid: key.kid
    })
    .setIssuedAt(now)
    .setExpirationTime(expired ? now - 3600 : now + 3600)
    .sign(key.privateKey)
}
