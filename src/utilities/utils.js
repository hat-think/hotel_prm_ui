import CryptoJS from "crypto-js";

const STORAGE_KEY = "encryption-secret-v1";
const TOKEN_KEY = "token";

// Encrypt data (Sync)
export const encryptData = (data, passphrase = STORAGE_KEY) => {
  const json = JSON.stringify(data);
  return CryptoJS.AES.encrypt(json, passphrase).toString();
};

// Decrypt data (Sync)
export const decryptData = (cipherText, passphrase = STORAGE_KEY) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, passphrase);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (e) {
    console.error("Decryption failed:", e);
    return null;
  }
};

// Save to localStorage
export const saveToStorage = (key, value) => {
  const encrypted = encryptData(value);
  localStorage.setItem(key, encrypted);
};

// Get from localStorage
export const getFromStorage = (key) => {
  const encrypted = localStorage.getItem(key);
  return decryptData(encrypted);
};

// Auth helpers
export const getAuthToken = () => {
  return getFromStorage(TOKEN_KEY);
};

export const setAuthToken = (token) => {
  saveToStorage(TOKEN_KEY, token);
};

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
