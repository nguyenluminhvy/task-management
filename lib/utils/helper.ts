import { Platform } from "react-native";

export function zeroOutSeconds (datetime: Date) {
  const date = new Date(datetime)
  date.setSeconds(0)

  return date
}

export const isIos = Platform.OS === "ios";

export function getEmailName(email: string): string {
  if (!email) return '';

  return email.split('@')[0];
}
