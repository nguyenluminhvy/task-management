import {Alert, Button, FlatList, ScrollView, Text, TextInput, View} from "react-native";
import {useAuth} from "@/lib/context/AuthContext";
import {TaskCategory, TaskPriority, TaskStatus} from "@/lib/constants/task";
import {useTasks} from "@/lib/hooks/useTasks";
import {useEffect, useState} from "react";
import * as Notifications from "expo-notifications";
import {useNotifications} from "@/lib/hooks/useNotification";
import {PickDateButton} from "@/lib/components/PickDateButton";
import moment from "moment";
import {zeroOutSeconds} from "@/lib/utils/helper";
import {router, useRouter} from "expo-router";

export default function Index() {
  const { push } = useRouter();


  const { user, signIn, signUp, signOut } = useAuth()
  const { tasks, addTask, deleteTask, initScheduledNotifications } = useTasks()

  const {scheduleNotificationAsync, cancelNotificationAsync, sendPushNotification, expoPushToken} = useNotifications();

  const [email, setEmail] = useState<string>('admin@admin.com');
  const [password, setPassword] = useState<string>('123456');
  const [scheduleLocal, setScheduleLocal] = useState([]);

  const [startDate, setStartDate] = useState<Date>(moment().toDate());


  const [title, setTitle] = useState('');
  const [reminderOffset, setReminderOffset] = useState('10');

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

  const getAllSchedule = async () => {
    const data = await Notifications.getAllScheduledNotificationsAsync()

    if (data?.length > 0) {


      const list = data.map((item) => {
        console.log(item, 'item')
        console.log(item.trigger?.value, 'item.trigger?.value')
        console.log(item.trigger?.seconds, 'item.trigger?.seconds')
        console.log('======item======')

        const targetTime = moment().add(item.trigger?.seconds, 'seconds');

        console.log('targetTime: ', targetTime)

        // const duration = moment.duration(item.trigger?.seconds, 'seconds');
        const duration = moment.duration(targetTime, 'seconds');

        const fromNow = moment(targetTime).fromNow()

        console.log('fromNow: ', fromNow)

        console.log(`In: ${Math.floor(duration.asMinutes())} minutes and ${Math.floor(duration.seconds())} seconds`);


        return {
          title: item?.identifier,
          trigger: moment(item.trigger?.value).format("YYYY-MM-DD HH:mm:ss"),
          seconds: moment(targetTime).format('YYYY-MM-DD HH:mm:ss'),
        }
      })

      setScheduleLocal(list);

      console.log(list, 'list getAllSchedule')


    } else {
      setScheduleLocal([]);
    }

    // console.log(data, 'data getAllSchedule')
  }

  const handleAdd = async () => {
    if (!user) return;

    try {
      const id = await addTask({
        title,
        category: TaskCategory.Personal,
        status: TaskStatus.Todo,
        priority: TaskPriority.Medium,
        scheduledAt: zeroOutSeconds(startDate),
        reminderOffset: Number(reminderOffset),
      });

      // Alert.alert('✅ Task added', `ID: ${taskId}`);
    } catch (err) {
      console.error(err);
      Alert.alert('❌ Failed to add task', (err as Error).message);
    }
  };

  return (
    <ScrollView
      style={{
        // flex: 1,
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
        <Button title="Sign In" onPress={async () => {
          const isLogged = await signIn(email, password)
          if (isLogged) router.push('/(homeTabs)')
        }} />
        <Button title="Sign Out" onPress={signOut} />
        {user && <Text>Welcome, {user.email}</Text>}

        <TextInput
          placeholder="Enter task title"
          placeholderTextColor="blue"
          value={title}
          onChangeText={setTitle}
          style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
        />
        <TextInput
          placeholder="Enter task title"
          placeholderTextColor="blue"
          value={reminderOffset}
          onChangeText={setReminderOffset}
          style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
        />

        <PickDateButton
          buttonColor={"#EEF5FD"}
          textColor={"#006EE9"}
          style={{
            borderWidth: 0.5,
            borderRadius: 12,
            borderColor: "rgba(0,110,233,0.4)",
          }}
          dateDefault={startDate}
          onDateChange={setStartDate}
        ></PickDateButton>

        <View>
          <Text>{JSON.stringify(startDate)}</Text>
          <Text>
            {moment(startDate).format('YYYY-MM-DD HH:mm:ss')}
          </Text>
        </View>
        <Button title="Add Task" onPress={handleAdd} />
        <Button title="Get all task" onPress={getAllSchedule} />
        <Button title="Init schedule all task" onPress={initScheduledNotifications} />

        {/*{<Text>expoPushToken, {expoPushToken}</Text>}*/}


        <Button
          title="Send me a notification"
          onPress={sendNotification}
        ></Button>
        {/*<Button*/}
        {/*  title="Send me a notification 2222"*/}
        {/*  onPress={sendPushNotification}*/}
        {/*></Button>*/}
        {/*<Button title="Cancel notification" onPress={cancelNotificationAsync} />*/}



        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id!}
          renderItem={({ item }) => <View style={{
            borderBottomWidth: 1,
            flexDirection: 'row',
          }}>

        <View>
          <Text>
            {`id: ${item.id}`}
          </Text>
          <Text>
            {`notificationId: ${item.notificationId}`}
          </Text>
          <Text>
            {item.title}
          </Text>
          <Text>
            {JSON.stringify(item.scheduledAt)}
          </Text>
          <Text>
            {moment(item.scheduledAt).format('YYYY-MM-DD HH:mm:ss')}
          </Text>
          <Text>
            {`reminderOffset: ${item.reminderOffset}`}
          </Text>
        </View>
            <Button title="Delete Task" onPress={() => {deleteTask(item.id)}} />
          </View>}
        />


        <Text>Schedule Local</Text>
        <Text>{JSON.stringify(scheduleLocal)}</Text>


      </View>
    </ScrollView>
  );
}
