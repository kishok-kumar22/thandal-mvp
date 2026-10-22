/**
 * Validates whether the given string is a 10-digit Indian mobile number.
 */
export function isValidMobile(value: string): boolean {
  if (!value) return false;
  const digitsOnly = value.replace(/\D/g, "");
  return /^[6-9]\d{9}$/.test(digitsOnly.slice(-10));
}

/**
 * Validates Indian postal code (exactly 6 digits).
 */
export function isValidPostalCode(value: string): boolean {
  if (!value) return false;
  const digitsOnly = value.replace(/\D/g, "");
  return /^[1-9][0-9]{5}$/.test(digitsOnly);
}

/**
 * Validates whether the given date of birth indicates an age of 18 or older.
 */
export function isAge18OrOlder(dobString: string): boolean {
  if (!dobString) return true; // optional field
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return false;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age >= 18;
}

/**
 * Validates email address format.
 */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Checks if input is a valid identifier (either mobile or email).
 */
export function isValidIdentifier(value: string): boolean {
  if (!value || value.trim().length === 0) return false;
  return isValidMobile(value) || isValidEmail(value);
}

/**
 * Validates password length (minimum 6 characters).
 */
export function isValidPassword(value: string): boolean {
  return Boolean(value && value.length >= 6);
}
