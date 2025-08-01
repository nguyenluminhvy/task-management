import {Stack} from "expo-router";

export default function Navigation() {
  return(
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "white",
          },
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "white",
          },
        }}
      />
      <Stack.Screen
        name="(homeTabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="task/[taskId]" />
    </Stack>
  )
}
