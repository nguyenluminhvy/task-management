import { TouchableOpacity, View } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { IconButton, MD3Colors, Switch, Text, Icon } from "react-native-paper";
import React, { useCallback } from "react";
import { useRouter } from "expo-router";

export type TaskItemProps = {
  id: number;
  title: string;
  time: string;
  type: string;
  status: boolean;
};

export function TaskItem({ id, title, time, type, status }: TaskItemProps) {
  const { push } = useRouter();
  const [turnOff, setTurnOff] = React.useState(false);

  const onEdit = useCallback(() => {
    push({
      pathname: "/task/[taskId]",
      params: {
        taskId: id,
      },
    });
  }, []);

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
          >{`2 Days ago`}</Text>

          <IconButton
            icon={turnOff ? "bell-off" : "bell"}
            mode={"contained"}
            iconColor={"#006EE9"}
            containerColor={"#F4F9FF"}
            size={16}
            animated
            onPress={() => setTurnOff(!turnOff)}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
