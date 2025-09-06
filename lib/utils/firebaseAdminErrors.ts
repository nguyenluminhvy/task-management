export const firebaseAdminErrorMessages: Record<string, string> = {
  "auth/claims-too-large": "The custom claims payload is too large.",
  "auth/email-already-exists": "The email address is already in use.",
  "auth/email-already-in-use": "The email address is already in use.",
  "auth/insufficient-permission": "Insufficient permissions to perform this action.",
  "auth/internal-error": "Internal server error. Please try again later.",
  "auth/invalid-credential": "The credential is invalid.",
  "auth/invalid-email": "The email address is invalid.",
  "auth/invalid-email-verified": "The emailVerified value is invalid.",
  "auth/invalid-password": "The password is invalid (minimum 8 characters).",
  "auth/too-many-requests": "Too many requests. Please try again later.",
  "auth/network-request-failed": "Network request failed",
};

export function getFirebaseAdminErrorMessage(code: string): string {
  return firebaseAdminErrorMessages[code] || "An unknown error occurred.";
}
