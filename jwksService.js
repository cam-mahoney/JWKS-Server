import { exportJWK } from "jose"

export async function buildJWKS(keys) {
  const jwkKeys = await Promise.all(
    keys.map(async k => {
      const jwk = await exportJWK(k.publicKey)
      return {
        ...jwk,
        kid: k.kid,
        use: "sig",
        alg: "RS256"
      }
    })
  )

  return { keys: jwkKeys }
}
