import bcrypt from "bcryptjs";
import { randomInt } from "node:crypto";

const SALT_ROUNDS = 10;

export function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

// Excludes visually ambiguous characters (0/O, 1/l/I) since this is meant
// to be read from an email and typed in by hand.
const TEMP_PASSWORD_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

export function generateTempPassword(length = 12) {
  let password = "";
  for (let i = 0; i < length; i++) {
    password += TEMP_PASSWORD_CHARS[randomInt(TEMP_PASSWORD_CHARS.length)];
  }
  return password;
}
