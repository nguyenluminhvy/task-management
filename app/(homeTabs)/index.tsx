import { StyleSheet, TouchableOpacity, View } from "react-native";
import { AnimatedFAB, Button, Chip, Switch, Text } from "react-native-paper";
import React, { useCallback, useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { TaskItem, TaskItemProps } from "@/lib/components/home/TaskItem";
import { useRouter } from "expo-router";
import { useTasks } from "@/lib/hooks/useTasks";
import {TaskCategory} from "@/lib/constants/task";
import {useAuth} from "@/lib/context/AuthContext";

const BUTTONS = [
  {
    label: "All",
    type: null,
  },
  {
    label: "Personal",
    type: TaskCategory.Personal,
  },
  {
    label: "Study",
    type: TaskCategory.Study,
  },
  {
    label: "Work",
    type: TaskCategory.Work,
  },
];


export default function HomeScreen() {
  const { push, dismissTo } = useRouter();
  const { signOut } = useAuth()
  const [filterType, setFilterType] = useState<TaskCategory | null>(null);

  const { tasks, addTask, deleteTask, initScheduledNotifications } = useTasks({
    category: filterType
  })


  // const fabStyle = { [animateFrom]: 16 };
  // const { data: categories } = useCategories();
  // const { data: tasks } = useTasks(filterType);

  // console.log(tasks, "tasks <<<");

  const onCreateTask = useCallback(() => {
    push({
      pathname: "/task/[taskId]",
      params: {
        taskId: "new",
      },
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems:'center', justifyContent: 'space-between'}}>
        <View>
          <Text
            variant="titleLarge"
            style={{ color: "#2E3A59", fontWeight: "bold" }}
          >
            Hello Rohan!
          </Text>
          <Text
            variant="titleSmall"
            style={{ fontWeight: "400", color: "#2E3A59" }}
          >
            Have a nice day.
          </Text>
        </View>

        <View>
          <Button
            icon={'logout'}
            mode="text"
            contentStyle={{
              flexDirection: 'row-reverse'
            }}
            textColor={'red'}
            onPress={async () => {
              await signOut();
              dismissTo('/login')
            }}
          >
            Logout
          </Button>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 8,
          marginTop: 24,
          paddingBottom: 8,
        }}
      >
        {BUTTONS.map((button, index) => {
          const isActive = button.type === filterType;

          return (
            <Button
              key={index}
              // icon="camera"
              mode="elevated"
              buttonColor={isActive ? "#006EE9" : "#F4F9FF"}
              textColor={isActive ? "white" : "black"}
              // labelStyle={{ fontWeight: isActive ? "bold" : "light" }}
              onPress={() => {
                setFilterType(button.type);
              }}
            >
              {button.label}
            </Button>
          );
        })}
      </View>

      <FlashList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 16, paddingBottom: 80 }}
      keyExtractor={(item) => item.id.toString()}
      data={tasks}
      renderItem={({ item }) => <TaskItem {...item} />}
      estimatedItemSize={200}
      />

      <AnimatedFAB
        icon={"plus"}
        label={""}
        extended={false}
        onPress={onCreateTask}
        visible
        color={"white"}
        animateFrom={"right"}
        iconMode={"static"}
        style={[styles.fabStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  fabStyle: {
    bottom: 16,
    right: 16,
    position: "absolute",
    backgroundColor: "#006EE9",
  },
});
