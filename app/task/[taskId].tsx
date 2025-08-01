import { Platform, View } from "react-native";
import React, { useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Text, IconButton, TextInput } from "react-native-paper";
import { isIos } from "@/lib/utils/helper";
import { PickDateButton } from "@/lib/components/ui/PickDateButton";
import moment from "moment";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";

enum TASK_TYPE {
  PERSONAL = "PERSONAL",
  STUDY = "STUDY",
  WORK = "WORK",
}

const CATEGORY_BUTTONS = [
  {
    label: "Personal",
    type: TASK_TYPE.PERSONAL,
    iconName: "account",
  },
  {
    label: "Study",
    type: TASK_TYPE.STUDY,
    iconName: "pencil",
  },
  {
    label: "Work",
    type: TASK_TYPE.WORK,
    iconName: "bag-checked",
  },
];

export default function TaskScreen() {
  const { taskId } = useLocalSearchParams();
  const isEditMode = taskId !== "new";

  const insets = useSafeAreaInsets();
  const bottom = isIos ? insets.bottom : 20;

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [categoryType, setCategoryType] = useState<TASK_TYPE>(
    TASK_TYPE.PERSONAL,
  );

  const [startDate, setStartDate] = React.useState<Date>(moment().toDate());
  const [endDate, setEndDate] = React.useState<Date>(
    moment().add(7, "days").toDate(),
  );

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
                mode="contained"
                buttonColor={"#F4F9FF"}
                textColor={"#006EE9"}
                contentStyle={{}}
                style={{
                  borderRadius: 12,
                }}
                onPress={() => {
                  // setCategoryType(button.type);
                }}
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
          {isEditMode && (
            <Text
              variant={"headlineLarge"}
              style={{
                color: "#006EE9",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Title
            </Text>
          )}

          <View
            style={{
              marginTop: isEditMode ? 8 : 20,
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
              ></PickDateButton>
            </View>

            <View style={{ flex: 1, gap: 8 }}>
              <Text style={{ color: "#006EE9", fontWeight: "bold" }}>Ends</Text>

              <PickDateButton
                buttonColor={"#fff"}
                textColor={"#006EE9"}
                style={{
                  borderWidth: 0.5,
                  borderRadius: 12,
                  borderColor: "rgba(0,110,233,0.4)",
                }}
                dateDefault={endDate}
                onDateChange={setEndDate}
              ></PickDateButton>
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
              value={title}
              onChangeText={(text) => setTitle(text)}
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
              Category
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
              }}
            >
              {CATEGORY_BUTTONS.map((button, index) => {
                const isActive = button.type === categoryType;

                return (
                  <Button
                    key={index}
                    icon={button.iconName}
                    mode="contained"
                    buttonColor={isActive ? "#006EE9" : "#F4F9FF"}
                    textColor={isActive ? "white" : "black"}
                    onPress={() => {
                      setCategoryType(button.type);
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
              Description
            </Text>
            <TextInput
              mode={"outlined"}
              multiline
              value={description}
              onChangeText={(text) => setDescription(text)}
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

          <View style={{ flex: 1, backgroundColor: "blue" }}></View>
        </View>
      </KeyboardAwareScrollView>
      <KeyboardToolbar />
    </>
  );
}
