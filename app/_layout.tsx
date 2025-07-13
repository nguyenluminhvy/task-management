import { Stack } from "expo-router";
import {NotificationsProvider} from "@/app/hooks/useNotification";
import {StatusBar} from "expo-status-bar";

export default function RootLayout() {
  return (
  <NotificationsProvider>
    <StatusBar style="dark"></StatusBar>
    <Stack />
  </NotificationsProvider>
  );
}
