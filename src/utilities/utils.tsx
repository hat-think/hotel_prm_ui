// cryptoUtils.ts
const TEXT_ENCODER = new TextEncoder();
const TEXT_DECODER = new TextDecoder();
const STORAGE_KEY = "encryption-secret-v1"; // Can be rotated

// Helper to generate a key from a passphrase
const getKey = async (passphrase: string) => {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    TEXT_ENCODER.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: TEXT_ENCODER.encode("salt-hotel-prm"),
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

export const encryptData = async (
  data: any,
  passphrase: string = STORAGE_KEY
) => {
  const key = await getKey(passphrase);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV

  const encoded = TEXT_ENCODER.encode(JSON.stringify(data));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  const buffer = new Uint8Array([...iv, ...new Uint8Array(encrypted)]);
  return btoa(String.fromCharCode(...buffer));
};

export const decryptData = async (
  cipherText: string,
  passphrase: string = STORAGE_KEY
) => {
  try {
    const rawData = atob(cipherText);
    const bytes = Uint8Array.from(rawData, (c) => c.charCodeAt(0));
    const iv = bytes.slice(0, 12);
    const encrypted = bytes.slice(12);

    const key = await getKey(passphrase);
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encrypted
    );

    return JSON.parse(TEXT_DECODER.decode(decrypted));
  } catch (e) {
    console.error("Decryption failed:", e);
    return null;
  }
};

export const saveToStorage = async (key: string, value: any) => {
  const encrypted = await encryptData(value);
  localStorage.setItem(key, encrypted);
};

export const getFromStorage = async (key: string) => {
  const encrypted = localStorage.getItem(key);
  console.log("encrypted",encrypted)
  if (!encrypted) return null;
  return await decryptData(encrypted);
};
