import {StyleSheet, View, Button, ScrollView, RefreshControl} from "react-native";
import { Icon, Text} from "react-native-paper";
import React, {useEffect, useState} from "react";
import {getReminderTime, useTasks} from "@/lib/hooks/useTasks";
import {TaskItem} from "@/lib/components/home/TaskItem";
import {FlashList} from "@shopify/flash-list";
import {Task} from "@/lib/services/taskService";
import * as Notifications from "expo-notifications";
import moment from "moment";

type GroupedTasksByMonth = {
  month: string;
  tasks: Task[];
}[];

function groupTasksByMonth(tasks: Task[]) {
  const groups: Record<string, Task[]> = {};

  tasks.forEach((task) => {
    const monthKey = moment(getReminderTime(task)).format("MMM-YYYY")

    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(task);
  });

  const sorted = Object.entries(groups)
    .sort(
      ([a], [b]) =>
        moment(a, "MMM-YYYY").valueOf() - moment(b, "MMM-YYYY").valueOf()
    )
    .map(([month, tasks]) => ({
      month,
      tasks: tasks.sort(
        (t1, t2) =>
          new Date(t1.scheduledAt).getTime() -
          new Date(t2.scheduledAt).getTime()
      ),
    }));

  return sorted;
}

export default function ScheduleScreen(props: any) {
  const { tasks, initScheduledNotifications } = useTasks()

  const [scheduleLocal, setScheduleLocal] = useState<GroupedTasksByMonth>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(async () => {
      await initScheduledNotifications();
      setRefreshing(false);
    }, 200);
  }, [initScheduledNotifications]);

  useEffect(() => {
    initScheduledNotifications()
  }, []);

  useEffect(() => {
    const loadAllSchedule = async (sourceTasks: any) => {
      const data = await Notifications.getAllScheduledNotificationsAsync()

      if (data?.length > 0 && sourceTasks?.length > 0) {
        const listNew = sourceTasks?.filter((task) => {
          return data.find((s) => s.identifier === task.notificationId)
        })

        const listSorted = groupTasksByMonth(listNew)

        setScheduleLocal(listSorted);
      } else {
        console.log('run setScheduleLocal []')
        setScheduleLocal([]);
      }
    }

    if (tasks?.length > 0) loadAllSchedule(tasks)
  }, [tasks]);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems:'center', justifyContent: 'space-between'}}>

        <View style={{flexDirection: 'row', gap: 4}}>
          <Icon source="calendar" color={'#006EE9'} size={28} />

          <Text
            variant="titleLarge"
            style={{ color: "#2E3A59", fontWeight: "bold" }}
          >
            Incoming schedule!
          </Text>

        </View>
      </View>

      <ScrollView
        contentContainerStyle={{gap: 16}} style={{
          paddingTop: 20
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {scheduleLocal.map((group) => (
          <View key={group.month} style={{gap: 4}}>
            <Text
              variant="labelLarge"
              style={{ color: "#2E3A59", fontWeight: "bold" }}
            >
              {group.month}
            </Text>
            <View>
              {group.tasks.map((task) => (
                <TaskItem key={task.id} {...task} />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
