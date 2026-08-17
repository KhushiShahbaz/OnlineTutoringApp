const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-()\s]{7,20}$/;

export type FieldErrors = Record<string, string>;

export function requireString(
  errors: FieldErrors,
  field: string,
  value: unknown,
  label: string,
  { min = 1, max = 2000 }: { min?: number; max?: number } = {}
): string {
  const str = typeof value === "string" ? value.trim() : "";
  if (str.length === 0) {
    errors[field] = `${label} is required.`;
  } else if (str.length < min) {
    errors[field] = `${label} must be at least ${min} characters.`;
  } else if (str.length > max) {
    errors[field] = `${label} must be under ${max} characters.`;
  }
  return str;
}

export function requireEmail(
  errors: FieldErrors,
  field: string,
  value: unknown,
  label = "Email"
): string {
  const str = typeof value === "string" ? value.trim() : "";
  if (!str) {
    errors[field] = `${label} is required.`;
  } else if (!EMAIL_REGEX.test(str)) {
    errors[field] = `Enter a valid ${label.toLowerCase()} address.`;
  }
  return str;
}

export function requirePhone(
  errors: FieldErrors,
  field: string,
  value: unknown,
  label = "Phone number"
): string {
  const str = typeof value === "string" ? value.trim() : "";
  if (!str) {
    errors[field] = `${label} is required.`;
  } else if (!PHONE_REGEX.test(str)) {
    errors[field] = `Enter a valid ${label.toLowerCase()}.`;
  }
  return str;
}

export function requirePassword(
  errors: FieldErrors,
  field: string,
  value: unknown,
  label = "Password"
): string {
  const str = typeof value === "string" ? value : "";
  if (!str) {
    errors[field] = `${label} is required.`;
  } else if (str.length < 8) {
    errors[field] = `${label} must be at least 8 characters.`;
  }
  return str;
}
