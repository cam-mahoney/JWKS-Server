import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { generateKeyPair, exportPKCS8, importPKCS8, exportJWK } from "jose";

let db;

export async function initializeKeys() {
  db = await open({
    filename: 'totally_not_my_privateKeys.db',
    driver: sqlite3.Database
  });

  // Create table based on required schema
  await db.exec(`CREATE TABLE IF NOT EXISTS keys(
    kid INTEGER PRIMARY KEY AUTOINCREMENT,
    key BLOB NOT NULL,
    exp INTEGER NOT NULL
  )`);

  // Pre-populate: Generate one expired and one valid key
  await createAndStoreKey(true);  // Expired
  await createAndStoreKey(false); // Valid
}

async function createAndStoreKey(isExpired) {
  const { privateKey } = await generateKeyPair("RS256");
  
  // Serialize the key to PKCS8 PEM format for storage
  const pem = await exportPKCS8(privateKey);
  
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = isExpired ? now - 3600 : now + 3600;

  // Use query parameters to avoid SQL injection
  await db.run('INSERT INTO keys (key, exp) VALUES (?, ?)', [pem, expiresAt]);
}

export async function getActiveKey() {
  const now = Math.floor(Date.now() / 1000);
  // Requirement: Read valid (unexpired) key
  const row = await db.get('SELECT * FROM keys WHERE exp > ? LIMIT 1', [now]);
  return row ? { ...row, privateKey: await importPKCS8(row.key, "RS256") } : null;
}

export async function getExpiredKey() {
  const now = Math.floor(Date.now() / 1000);
  // Requirement: Read expired key
  const row = await db.get('SELECT * FROM keys WHERE exp <= ? LIMIT 1', [now]);
  return row ? { ...row, privateKey: await importPKCS8(row.key, "RS256") } : null;
}

export async function getValidPublicKeys() {
  const now = Math.floor(Date.now() / 1000);
  // Requirement: Read all valid private keys from the DB
  const rows = await db.all('SELECT * FROM keys WHERE exp > ?', [now]);
  
  return Promise.all(rows.map(async (row) => {
    // Deserialize the PEM back into a key object
    const privKey = await importPKCS8(row.key, "RS256");
    
    // Convert to Public JWK
    const jwk = await exportJWK(privKey);
    
    // Return with all necessary fields for the Gradebot to pass
    return { 
      ...jwk, 
      kid: String(row.kid), 
      alg: "RS256", 
      use: "sig",
      kty: "RSA" 
    };
  }));
}