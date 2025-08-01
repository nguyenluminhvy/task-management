import { Tabs } from "expo-router";
import React from "react";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "@/lib/components/HapticTab";
import { Icon, MD3Colors } from "react-native-paper";

export default function TabLayout() {
  const { top } = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          paddingTop: top,
          backgroundColor: "#F4F9FF",
        },
        tabBarActiveTintColor: "#006EE9",
        tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
        // tabBarStyle: Platform.select({
        //   ios: {
        //     // Use a transparent background on iOS to show the blur effect
        //     position: 'absolute',
        //   },
        //   default: {},
        // }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color }) => (
            <Icon source="format-list-checks" color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Schedule",
          tabBarIcon: ({ color }) => (
            <Icon source="calendar-clock" color={color} size={28} />
          ),
        }}
      />
    </Tabs>
  );
}
