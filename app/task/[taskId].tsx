import {Alert, Platform, View} from "react-native";
import React, { useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Text, IconButton, TextInput } from "react-native-paper";
import {isIos, zeroOutSeconds} from "@/lib/utils/helper";
import { PickDateButton } from "@/lib/components/ui/PickDateButton";
import moment from "moment";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import {TaskCategory, TaskPriority, TaskStatus} from "@/lib/constants/task";
import {useTasks} from "@/lib/hooks/useTasks";
import {Task} from "@/lib/services/taskService";

const CATEGORY_BUTTONS = [
  {
    label: "Personal",
    type: TaskCategory.Personal,
    iconName: "account",
  },
  {
    label: "Study",
    type: TaskCategory.Study,
    iconName: "pencil",
  },
  {
    label: "Work",
    type: TaskCategory.Work,
    iconName: "bag-checked",
  },
];

const REMIND_BEFORE_BUTTONS = [
  {
    label: "5 minutes",
    value: 5,
  },{
    label: "10 minutes",
    value: 10,
  },{
    label: "15 minutes",
    value: 15,
  },
];

export const STATUS_BUTTONS = [
  {
    label: "To do",
    type: TaskStatus.Todo,
  },
  {
    label: "In Progress",
    type: TaskStatus.InProgress,
  },
  {
    label: "Completed",
    type: TaskStatus.Completed,
  },
];

export const PRIORITY_BUTTONS = [
  {
    label: "Low",
    type: TaskPriority.Low,
  },
  {
    label: "Medium",
    type: TaskPriority.Medium,
  },
  {
    label: "High",
    type: TaskPriority.High,
  },
];

export default function TaskScreen(props: any) {
  const { taskId } = useLocalSearchParams();
  const isEditMode = taskId !== "new";

  const { getTaskDetail, addTask, updateTask, loading: taskLoading, loadAllSchedule } = useTasks()

  const insets = useSafeAreaInsets();
  const bottom = isIos ? insets.bottom : 20;

  const [task, setTask] = useState<Task>({
    id: undefined,
    title: "",
    description: "",
    category: undefined,
    status: undefined,
    priority: undefined,
    scheduledAt: moment().toDate(),
    reminderOffset: 0,
    notificationId: undefined,
    createdAt: undefined,
  });


  const [startDate, setStartDate] = React.useState<Date>(moment().toDate());

  useEffect(() => {
    (async () => {
      if (taskId) {
        const data = await getTaskDetail(taskId)

        if (data) {
          setTask(data)
          setStartDate(data.scheduledAt)
        } else {
          setTask(prev => ({
            ...prev,
            category: TaskCategory.Personal,
            status: TaskStatus.Todo,
            priority: TaskPriority.Medium,
            reminderOffset: 10,
          }))
        }
      }
    })();
  }, [taskId]);

  const onUpdateTask = async () => {
    try {
      if (taskLoading) return

      const data = {
        title: task.title,
        description: task.description,
        category: task.category,
        status: task.status,
        priority: task.priority,
        scheduledAt: zeroOutSeconds(startDate),
        reminderOffset: Number(task.reminderOffset),
      }

      if (isEditMode) {
        await updateTask(taskId, data)
      } else {
        await addTask(data)
      }

      await loadAllSchedule()

      router.back()
    } catch (err) {
      console.error(err);
      Alert.alert('❌ Failed to add task', (err as Error).message);
    }
  }


  return (
    <>
      <KeyboardAwareScrollView bottomOffset={100}>
        <Stack.Screen
          options={{
            headerShadowVisible: false,
            headerTitleAlign: "center",
            title: isEditMode ? "Edit Task" : "Create Task",
            headerLeft: () => (
              <IconButton
                icon={"arrow-left"}
                mode={"contained"}
                iconColor={"#006EE9"}
                containerColor={"white"}
                style={{
                  borderRadius: 8,
                }}
                onPress={() => router.back()}
                size={20}
              />
            ),
            headerRight: () => (
              <Button
                loading={taskLoading}
                mode="contained"
                buttonColor={"#F4F9FF"}
                textColor={"#006EE9"}
                contentStyle={{}}
                style={{
                  borderRadius: 12,
                }}
                onPress={onUpdateTask}
              >
                {isEditMode ? "Update" : "Create"}
              </Button>
            ),
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: "#006EE9",
            },
            contentStyle: {
              // backgroundColor: "#006EE9",
              backgroundColor: "white",
            },
          }}
        />

        <View
          style={{
            height: 200,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: "#006EE9",
          }}
        ></View>

        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            marginTop: 50,
            paddingBottom: bottom,
            borderTopRightRadius: 50,
            borderTopLeftRadius: 50,
            padding: 16,
            paddingHorizontal: 20,
            gap: 20,
          }}
        >
          {/*{isEditMode && (*/}
          {/*  <Text*/}
          {/*    variant={"headlineLarge"}*/}
          {/*    style={{*/}
          {/*      color: "#006EE9",*/}
          {/*      fontWeight: "bold",*/}
          {/*      textAlign: "center",*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    Title*/}
          {/*  </Text>*/}
          {/*)}*/}

          <View
            style={{
              // marginTop: isEditMode ? 8 : 20,
              marginTop:  20,
              flexDirection: "row",
              gap: 16,
            }}
          >
            <View style={{ flex: 1, gap: 8 }}>
              <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
                Start
              </Text>
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
              />
            </View>

            <View style={{ flex: 1, gap: 8 }}>
              <Text style={{ color: "#006EE9", fontWeight: "bold" }}>Time</Text>

              <PickDateButton
                calendarMode={'time'}
                format={'HH:mm'}
                buttonColor={"#fff"}
                textColor={"#006EE9"}
                style={{
                  borderWidth: 0.5,
                  borderRadius: 12,
                  borderColor: "rgba(0,110,233,0.4)",
                }}
                dateDefault={startDate}
                onDateChange={setStartDate}
              />
            </View>
          </View>

          <View
            style={{
              gap: 8,
            }}
          >
            <Text style={{ color: "#006EE9", fontWeight: "bold" }}>Title</Text>
            <TextInput
              mode={"outlined"}
              value={task.title}
              onChangeText={(text) => setTask(prev => ({ ...prev, title: text }))}
              outlineColor={"rgba(0,110,233,0.4)"}
              activeOutlineColor={"rgba(0,110,233,0.4)"}
              style={{
                backgroundColor: "white",
                fontSize: 14,
              }}
              outlineStyle={{
                borderWidth: 0.5,
                borderRadius: 12,
              }}
            />
          </View>

          <View
            style={{
              gap: 8,
            }}
          >
            <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
              Description
            </Text>
            <TextInput
              mode={"outlined"}
              multiline
              value={task.description}
              onChangeText={(text) => setTask(prev => ({ ...prev, description: text }))}
              outlineColor={"rgba(0,110,233,0.4)"}
              activeOutlineColor={"rgba(0,110,233,0.4)"}
              style={{
                backgroundColor: "white",
                fontSize: 14,
              }}
              contentStyle={{
                height: 160,
              }}
              outlineStyle={{
                borderWidth: 0.5,
                borderRadius: 12,
              }}
            />
          </View>

          <View
            style={{
              gap: 8,
            }}
          >
            <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
              Category
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
              }}
            >
              {CATEGORY_BUTTONS.map((button, index) => {
                const isActive = button.type === task.category;

                return (
                  <Button
                    key={index}
                    icon={button.iconName}
                    mode="contained"
                    buttonColor={isActive ? "#006EE9" : "#F4F9FF"}
                    textColor={isActive ? "white" : "black"}
                    onPress={() => {
                      setTask(prev => ({ ...prev, category: button.type }));
                    }}
                  >
                    {button.label}
                  </Button>
                );
              })}
            </View>
          </View>

          <View
            style={{
              gap: 8,
            }}
          >
            <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
              Remind Before
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
              }}
            >
              {REMIND_BEFORE_BUTTONS.map((button, index) => {
                const isActive = button.value === task.reminderOffset;

                return (
                  <Button
                    key={index}
                    mode="contained"
                    buttonColor={isActive ? "#006EE9" : "#F4F9FF"}
                    textColor={isActive ? "white" : "black"}
                    onPress={() => {
                      setTask(prev => ({ ...prev, reminderOffset: button.value }));
                    }}
                  >
                    {button.label}
                  </Button>
                );
              })}
            </View>
          </View>

          <View
            style={{
              gap: 8,
            }}
          >
            <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
              Status
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
              }}
            >
              {STATUS_BUTTONS.map((button, index) => {
                const isActive = button.type === task.status;

                return (
                  <Button
                    key={index}
                    mode="contained"
                    buttonColor={isActive ? "#006EE9" : "#F4F9FF"}
                    textColor={isActive ? "white" : "black"}
                    onPress={() => {
                      setTask(prev => ({ ...prev, status: button.type }));
                    }}
                  >
                    {button.label}
                  </Button>
                );
              })}
            </View>
          </View>

          <View
            style={{
              gap: 8,
            }}
          >
            <Text style={{ color: "#006EE9", fontWeight: "bold" }}>
              Priority
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
              }}
            >
              {PRIORITY_BUTTONS.map((button, index) => {
                const isActive = button.type === task.priority;

                return (
                  <Button
                    key={index}
                    mode="contained"
                    buttonColor={isActive ? "#006EE9" : "#F4F9FF"}
                    textColor={isActive ? "white" : "black"}
                    onPress={() => {
                      setTask(prev => ({ ...prev, priority: button.type }));
                    }}
                  >
                    {button.label}
                  </Button>
                );
              })}
            </View>
          </View>

          <View style={{ flex: 1, backgroundColor: "blue" }}></View>
        </View>
      </KeyboardAwareScrollView>
      <KeyboardToolbar />
    </>
  );
}
