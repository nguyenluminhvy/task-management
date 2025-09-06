import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef, useState,
} from "react";
import * as Notifications from "expo-notifications";
import {Linking, Platform} from "react-native";

import * as TaskManager from 'expo-task-manager';


const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
  console.log('Received a notification in the background!');
  // Do something with the notification data
});

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

interface NotificationContextType {
  scheduleNotificationAsync: (
    request: Notifications.NotificationRequestInput
  ) => Promise<void>;
  cancelNotificationAsync: () => Promise<void>;
  sendPushNotification: () => Promise<void>;
  expoPushToken: string;
}

const NotificationsContext = createContext<NotificationContextType | undefined>(
  undefined
);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const NotificationsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );

  useEffect(() => {
    const configureNotificationsAsync = async () => {
      const { granted } = await Notifications.requestPermissionsAsync();
      if (!granted) {
        return console.warn("⚠️ Notification Permissions not granted!");
      }
    };
    configureNotificationsAsync();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response, 'response addNotificationResponseReceivedListener <<<')

      const url = response.notification.request.content.data.url;
      // Linking.openURL(url);
    });
    return () => subscription.remove();
  }, []);

  const scheduledNotificationRef = useRef<string>("");

  const scheduleNotificationAsync = async (
    request: Notifications.NotificationRequestInput
  ) => {
    const notification = await Notifications.scheduleNotificationAsync(request);
    scheduledNotificationRef.current = notification;
    console.log(
      "✍️ Scheduling notification: ",
      scheduledNotificationRef.current
    );
  };

  const cancelNotificationAsync = async () => {
    console.log(
      "🗑️ Canceling notification: ",
      scheduledNotificationRef.current
    );
    await Notifications.cancelScheduledNotificationAsync(
      scheduledNotificationRef.current
    );
    scheduledNotificationRef.current = "";
  };

  async function sendPushNotification(expoPushToken: string) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Original Title',
      body: 'And here is the body!',
      data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }

  const value = { scheduleNotificationAsync, cancelNotificationAsync, sendPushNotification, expoPushToken };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

const useNotifications = () => {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error(
      "useNotifications must be called from within a NotificationProvider!"
    );
  }

  return context;
};

export { useNotifications, NotificationsProvider };
