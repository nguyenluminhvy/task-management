import { StyleSheet, TouchableOpacity, View } from "react-native";
import { AnimatedFAB, Button, Chip, Switch, Text } from "react-native-paper";
import React, { useCallback, useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { TaskItem, TaskItemProps } from "@/lib/components/home/TaskItem";
import { useRouter } from "expo-router";
import { useTasks } from "@/lib/hooks/useTasks";
import {TaskCategory} from "@/lib/constants/task";

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

const DATA: TaskItemProps[] = [
  {
    id: 1,
    title: "Design Changes",
    time: "2 Days ago",
    type: "Ca nhan",
    status: true,
  },
  {
    id: 2,
    title: "First Item",
    time: "First Item",
    type: "First Item",
    status: true,
  },
  {
    id: 3,
    title: "First Item",
    time: "First Item",
    type: "First Item",
    status: true,
  },
  {
    id: 4,
    title: "First Item",
    time: "First Item",
    type: "First Item",
    status: true,
  },
  {
    id: 5,
    title: "First Item",
    time: "First Item",
    type: "First Item",
    status: true,
  },
  {
    id: 6,
    title: "First Item",
    time: "First Item",
    type: "First Item",
    status: true,
  },
  {
    id: 7,
    title: "First Item",
    time: "First Item",
    type: "First Item",
    status: true,
  },
  {
    id: 8,
    title: "First Item",
    time: "First Item",
    type: "First Item",
    status: true,
  },
  {
    id: 9,
    title: "First Item",
    time: "First Item",
    type: "First Item",
    status: true,
  },
  {
    id: 10,
    title: "First Item",
    time: "First Item",
    type: "First Item",
    status: true,
  },
  {
    id: 11,
    title: "First Item",
    time: "First Item",
    type: "First Item",
    status: true,
  },
  {
    id: 12,
    title: "First Item",
    time: "First Item",
    type: "First Item",
    status: true,
  },
  {
    id: 13,
    title: "First Item",
    time: "First Item",
    type: "First Item",
    status: true,
  },
];

export default function HomeScreen() {
  const { push } = useRouter();
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
