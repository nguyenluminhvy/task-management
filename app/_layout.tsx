import { Stack } from "expo-router";
import {AuthProvider} from "@/lib/context/AuthContext";
import {NotificationsProvider} from "@/app/hooks/useNotification";
import {StatusBar} from "expo-status-bar";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark"></StatusBar>
      <NotificationsProvider>
        <Stack />
      </NotificationsProvider>
    </AuthProvider>
  );
}
