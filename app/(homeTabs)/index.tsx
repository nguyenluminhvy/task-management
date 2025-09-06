import {Alert, StyleSheet, TouchableOpacity, View} from "react-native";
import {AnimatedFAB, Button, Chip, Icon, MD3Colors, Modal, Portal, Switch, Text} from "react-native-paper";
import React, { useCallback, useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { TaskItem, TaskItemProps } from "@/lib/components/home/TaskItem";
import { useRouter } from "expo-router";
import { useTasks } from "@/lib/hooks/useTasks";
import {TaskCategory, TaskStatus} from "@/lib/constants/task";
import {useAuth} from "@/lib/context/AuthContext";
import {AppTextInput} from "@/lib/components/ui/AppTextInput";
import {AdvancedFilterModal, AdvancedFilterValue} from "@/lib/components/AdvancedFilterModal";
import moment from "moment/moment";
import {getEmailName} from "@/lib/utils/helper";
import {IMAGES} from "@/lib/assets/images";
import {Image} from "expo-image";

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
  const { signOut, user } = useAuth()


  const [filterType, setFilterType] = useState<TaskCategory | null>(null);
  const [searchText, setSearchText] = useState('');
  const [advancedFilterValue, setAdvancedFilterValue] = useState<AdvancedFilterValue>({
    status: undefined,
    priority: undefined,
    range: undefined,
  });

  const { tasks } = useTasks({
    category: filterType,
    priority: advancedFilterValue.priority,
    status: advancedFilterValue.status,
    range: advancedFilterValue.range
  })

  const taskFiltered = tasks.filter(task => {
    const text = searchText.toLowerCase().trim();
    return (
      task.title.toLowerCase().includes(text) ||
      (task.description?.toLowerCase().includes(text) ?? false)
    );
  });

  const onCreateTask = useCallback(() => {
    push({
      pathname: "/task/[taskId]",
      params: {
        taskId: "new",
      },
    });
  }, []);

  const onLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              dismissTo("/login");
            } catch (error) {
              console.error("Logout failed:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems:'center', justifyContent: 'space-between', marginBottom: 16}}>
        <View>
          <Text
            variant="titleLarge"
            style={{ color: "#2E3A59", fontWeight: "bold" }}
          >
            {`Hello ${getEmailName(user?.email)} !`}
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
            onPress={onLogout}
          >
            Logout
          </Button>
        </View>
      </View>

      <AppTextInput
        showSearchIcon
        autoCapitalize="none"
        placeholder="Search task title"
        value={searchText}
        onChangeText={(value) => {
          setSearchText(value)
        }}
        RightComponent={<AdvancedFilterModal value={advancedFilterValue} onChange={(data) => {
          console.log(data, 'data AdvancedFilterModal');
          setAdvancedFilterValue(data)
        }}/>}
      />

      <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 4, paddingTop: 8}}>
        {
          advancedFilterValue.status && (
            <Chip selectedColor={'white'} style={{
              backgroundColor: '#006EE9'
            }} onClose={() => {
              setAdvancedFilterValue(prev => ({ ...prev, status: undefined }));
            }}>{`Status: ${advancedFilterValue.status}`}</Chip>
          )
        }
        {
          advancedFilterValue.priority && (
            <Chip selectedColor={'white'} style={{
              backgroundColor: '#006EE9'
            }} onClose={() => {
              setAdvancedFilterValue(prev => ({ ...prev, priority: undefined }));
            }}>{`Priority: ${advancedFilterValue.priority}`}</Chip>
          )
        }
        {
          advancedFilterValue.range && (
            <Chip selectedColor={'white'} style={{
              backgroundColor: '#006EE9'
            }} onClose={() => {
              setAdvancedFilterValue(prev => ({ ...prev, range: undefined }));
            }}>{`from ${moment(advancedFilterValue.range.start).format("MMM-DD-YYYY")} to ${moment(advancedFilterValue.range.end).format("MMM-DD-YYYY")}`}</Chip>
          )
        }
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 8,
          paddingBottom: 8,
          marginTop: 16
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
        ListEmptyComponent={<View style={{
          flex: 1,
          paddingTop: 100,
          alignItems: 'center',
          gap: 8
        }}>
          <Image
            style={{
              width: "100%",
              height: 50,
            }}
            source={IMAGES.nodata}
            contentFit="contain"
          />
          <Text variant={'labelMedium'}>
            No data
          </Text>
          <Button
            style={{
              borderRadius: 8,
              borderWidth: 0.5,
              borderColor: '#006EE9',
              borderStyle: 'dashed'
            }}
            mode="contained"
            buttonColor={"white"}
            textColor={"#006EE9"}
            onPress={onCreateTask}
          >
            + Create new task
          </Button>
        </View>}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 16, paddingBottom: 80 }}
        keyExtractor={(item) => item.id.toString()}
        data={taskFiltered}
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
