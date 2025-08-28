export function validateEmail(email: string): string | null {
  if (!email) {
    return "Email is required.";
  }

  if (email.length < 6) {
    return "Email must be at least 6 characters.";
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return "Email is not valid.";
  }

  return null;
}

export function hasSpecialCharacters(str: string): boolean {
  const regex = /[^a-zA-Z0-9\s]/;
  return regex.test(str);
}

export function isValidPasswordLength(
  password: string,
  min: number = 6,
  max: number = 20,
): boolean {
  return password.length >= min && password.length <= max;
}

export function isAlphanumeric(str: string): boolean {
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(str);
}
