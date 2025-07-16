import {Alert, Button, FlatList, Text, TextInput, View} from "react-native";
import {useAuth} from "@/lib/context/AuthContext";
import {TaskCategory, TaskPriority, TaskStatus} from "@/lib/constants/task";
import {useTasks} from "@/lib/hooks/useTasks";
import {Button, Text, TextInput, View} from "react-native";
import {useEffect, useState} from "react";
import * as Notifications from "expo-notifications";
import {useNotifications} from "@/app/hooks/useNotification";




export default function Index() {
  const { user, signIn, signUp, signOut } = useAuth()
  const { tasks, addTask } = useTasks()

  const {scheduleNotificationAsync, cancelNotificationAsync, sendPushNotification, expoPushToken} = useNotifications();

  const [email, setEmail] = useState<string>('admin@admin.com');
  const [password, setPassword] = useState<string>('123456');

  const [title, setTitle] = useState('');
  useEffect(() => {
    const configureNotificationsAsync = async () => {
      const { granted } = await Notifications.requestPermissionsAsync();
      if (!granted) {
        return console.warn("⚠️ Notification Permissions not granted!");
      }
    };
    configureNotificationsAsync();
  }, []);

  const sendNotification = () => {
    scheduleNotificationAsync({
      content: {
        title: "🧪 Test notification!",
        body: 'this is body',
        subtitle: 'this is subtitle',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
      },
    });
  };

  const handleAdd = async () => {
    if (!user) return;

    try {
      const id = await addTask({
        title,
        category: TaskCategory.Personal,
        status: TaskStatus.NotStarted,
        priority: TaskPriority.Medium,
        scheduledAt: new Date(),
        reminderEnabled: false,
      });

      Alert.alert('✅ Task added', `ID: ${id}`);
    } catch (err) {
      console.error(err);
      Alert.alert('❌ Failed to add task', (err as Error).message);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>

      <View style={{ padding: 20 }}>
        <TextInput
          autoCapitalize="none"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{ borderBottomWidth: 1, marginBottom: 10 }}
        />
        <TextInput
          autoCapitalize="none"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{ borderBottomWidth: 1, marginBottom: 20 }}
        />
        <Button title="Sign Up" onPress={() => signUp(email, password)} />
        <Button title="Sign In" onPress={() => signIn(email, password)} />
        <Button title="Sign Out" onPress={signOut} />
        {user && <Text>Welcome, {user.email}</Text>}

        <TextInput
          placeholder="Enter task title"
          value={title}
          onChangeText={setTitle}
          style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
        />
        <Button title="Add Task" onPress={handleAdd} />

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id!}
          renderItem={({ item }) => <View>
           <Text>
             {JSON.stringify(item)}
           </Text>
          </View>}
        />
        {<Text>expoPushToken, {expoPushToken}</Text>}


        <Button
          title="Send me a notification"
          onPress={sendNotification}
        ></Button>
        <Button
          title="Send me a notification 2222"
          onPress={sendPushNotification}
        ></Button>
        <Button title="Cancel notification" onPress={cancelNotificationAsync} />

      </View>
    </View>
  );
}
