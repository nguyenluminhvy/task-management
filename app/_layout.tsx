import {AuthProvider} from "@/lib/context/AuthContext";
import {NotificationsProvider} from "@/lib/hooks/useNotification";
import {StatusBar} from "expo-status-bar";
import {PaperProvider} from "react-native-paper";
import {KeyboardProvider} from "react-native-keyboard-controller";
import Navigation from "@/lib/components/Navigation";

export default function RootLayout() {
  return (
    <PaperProvider>
      <AuthProvider>
        <StatusBar style="dark"></StatusBar>
        <NotificationsProvider>
          <KeyboardProvider>
            <Navigation />
          </KeyboardProvider>
        </NotificationsProvider>
      </AuthProvider>
    </PaperProvider>

  );
}
