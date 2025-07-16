import {Alert, Button, FlatList, Text, TextInput, View} from "react-native";
import {useState} from "react";
import {useAuth} from "@/lib/context/AuthContext";
import {TaskCategory, TaskPriority, TaskStatus} from "@/lib/constants/task";
import {useTasks} from "@/lib/hooks/useTasks";


export default function Index() {
  const { user, signIn, signUp, signOut } = useAuth()
  const { tasks, addTask } = useTasks()

  const [email, setEmail] = useState<string>('admin@admin.com');
  const [password, setPassword] = useState<string>('123456');

  const [title, setTitle] = useState('');

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
      </View>
    </View>
  );
}
