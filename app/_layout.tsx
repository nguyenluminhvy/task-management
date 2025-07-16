import { Stack } from "expo-router";
import {AuthProvider} from "@/lib/context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack />
    </AuthProvider>
  );
}
