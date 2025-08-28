import {Alert, TouchableOpacity, View} from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { IconButton, MD3Colors, Switch, Text, Icon } from "react-native-paper";
import React, { useCallback } from "react";
import { useRouter } from "expo-router";
import {getReminderTime, useTasks} from "@/lib/hooks/useTasks";
import {Task} from "@/lib/services/taskService";
import moment from "moment";
import {TaskStatus} from "@/lib/constants/task";

export type TaskItemProps = {
  id: number;
  title: string;
  time: string;
  type: string;
  status: boolean;
};

const STATUS_BACKGROUND_COLOR = {
  [TaskStatus.Todo]: 'rgba(214, 228, 253, 0.15)',
  [TaskStatus.InProgress]: 'rgba(247, 147, 26, 0.1)',
  [TaskStatus.Completed]: 'rgba(22, 199, 132, 0.15)',
}

const STATUS_TEXT_COLOR = {
  [TaskStatus.Todo]: 'rgba(139, 157, 189, 1)',
  [TaskStatus.InProgress]: 'rgba(247, 147, 26, 1)',
  [TaskStatus.Completed]: 'rgba(22, 199, 132, 1)',
}

export function TaskItem({ id, title, status, scheduledAt, reminderOffset }: Task) {
  const { push } = useRouter();
  const [turnOff, setTurnOff] = React.useState(false);
  const { deleteTask } = useTasks()

  const date = moment(getReminderTime({scheduledAt, reminderOffset} as Task)).format("HH:mm MMM-DD-YYYY")

  const onEdit = useCallback(() => {
    push({
      pathname: "/task/[taskId]",
      params: {
        taskId: id,
      },
    });
  }, [id, push]);

  const onDelete = () => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteTask(id);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderStatus = () => {
    let bgColor = STATUS_BACKGROUND_COLOR[status];
    let textColor = STATUS_TEXT_COLOR[status];

    return (
      <View style={{
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: bgColor,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 50
      }}>
        <Text variant={"labelSmall"} style={{ fontWeight: "bold", color: textColor }}>
          {status}
        </Text>
      </View>
    )
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 8,
        gap: 8,
        height: 74,
        marginBottom: 8,
      }}
      onPress={onEdit}
    >
      <View
        style={{
          backgroundColor: "#006EE9",
          borderRadius: 8,
          padding: 8,
        }}
      >
        <Icon source={"format-list-bulleted"} color={"white"} size={24} />
      </View>

      <View
        style={{
          flex: 1,
          // gap: 4,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            // flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: 4,
          }}
        >
          <Text variant={"titleSmall"} style={{ fontWeight: "bold" }}>
            {title}
          </Text>
          {
            renderStatus()
          }


          {/*<View*/}
          {/*  style={{*/}
          {/*    backgroundColor: "grey",*/}
          {/*    paddingHorizontal: 8,*/}
          {/*    borderRadius: 50,*/}
          {/*    alignItems: "center",*/}
          {/*    justifyContent: "center",*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <Text variant={"bodySmall"} style={{}}>{`Ca nhan`}</Text>*/}
          {/*</View>*/}
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            variant={"bodySmall"}
            style={{ fontWeight: "light" }}
          >{date}</Text>

          <View style={{
            flexDirection: 'row'
          }}>
            {/*<IconButton*/}
            {/*  icon={turnOff ? "bell-off" : "bell"}*/}
            {/*  mode={"contained"}*/}
            {/*  iconColor={"#006EE9"}*/}
            {/*  containerColor={"#F4F9FF"}*/}
            {/*  size={16}*/}
            {/*  animated*/}
            {/*  onPress={() => setTurnOff(!turnOff)}*/}
            {/*/>*/}
            <IconButton
              icon={"trash-can"}
              mode={"contained"}
              iconColor={"red"}
              containerColor={"#F4F9FF"}
              size={16}
              animated
              onPress={() => onDelete()}
            />
          </View>


        </View>
      </View>
    </TouchableOpacity>
  );
}
