// Encryption utilities for SecureVault
import CryptoJS from "crypto-js"

export class PasswordEncryption {
  private static readonly ALGORITHM = "AES"

  static encrypt(password: string, masterKey: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(password, masterKey).toString()
      return encrypted
    } catch (error) {
      throw new Error("Encryption failed")
    }
  }

  static decrypt(encryptedPassword: string, masterKey: string): string {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedPassword, masterKey)
      return decrypted.toString(CryptoJS.enc.Utf8)
    } catch (error) {
      throw new Error("Decryption failed")
    }
  }

  static generateMasterKey(): string {
    return CryptoJS.lib.WordArray.random(256 / 8).toString()
  }

  static hashPassword(password: string): string {
    return CryptoJS.SHA256(password).toString()
  }
}
