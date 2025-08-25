import {Alert, FlatList, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import {useAuth} from "@/lib/context/AuthContext";
import {TaskCategory, TaskPriority, TaskStatus} from "@/lib/constants/task";
import {useTasks} from "@/lib/hooks/useTasks";
import {useEffect, useState} from "react";
import * as Notifications from "expo-notifications";
import {useNotifications} from "@/lib/hooks/useNotification";
import {router, useRouter} from "expo-router";
import {Image} from "expo-image";
import {IMAGES} from "@/lib/assets/images";
import {isIos} from "@/lib/utils/helper";
import {SafeAreaView} from "react-native-safe-area-context";
import {Button, Text} from "react-native-paper";
import {AppTextInput} from "@/lib/components/ui/AppTextInput";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";

export default function Index() {
  const { push } = useRouter();
  const { user, signIn, signUp, signOut } = useAuth()

  const { tasks, addTask, deleteTask, initScheduledNotifications } = useTasks()

  const {scheduleNotificationAsync, cancelNotificationAsync, sendPushNotification, expoPushToken} = useNotifications();


  const [email, setEmail] = useState<string>('vyuser005@yopmail.com');
  const [password, setPassword] = useState<string>('12345678');

  return (
    <SafeAreaView style={{ flex: 1,  }}>
      <KeyboardAwareScrollView bottomOffset={100}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 16,
          }}
        >
          <View
            style={{
              alignItems: "center",
              marginTop: 100,
              gap: 16,
            }}
          >
            <View style={{
              alignItems: "center",
            }}>
              <Text variant="displayMedium" style={{
                fontWeight: 'bold',
                color: '#105CDB'
              }}>Task-Y</Text>
              <Text variant="headlineSmall" style={{
                fontWeight: 'semibold',
                color: '#9A9A9A'
              }}>Management App</Text>

            </View>

          </View>

          <View style={{
            marginTop: 40
          }}>
            <Text
              variant="titleSmall"
              style={{
                textAlign: "center",
                marginBottom: 20
              }}
            >
              Login to your account
            </Text>

            <AppTextInput
              autoCapitalize="none"
              placeholder="Email"
              value={email}
              onChangeText={(value) => {
                setEmail(value.trim())
              }}
            />
            <AppTextInput
              autoCapitalize="none"
              placeholder="Email"
              value={password}
              secureTextEntry
              onChangeText={(value) => {
                setPassword(value.trim())
              }}
            />

            <TouchableOpacity
              onPress={() => {
                router.push('/forgot-password')
              }}
              style={{
                marginVertical: 8,
                alignSelf: 'flex-end'
              }}>
              <Text
                style={{
                  textAlign: "right",
                  color: '#006EE9'
                }}
              >
                Forgot password?
              </Text>
            </TouchableOpacity>


            <Button
              mode="contained"
              buttonColor="#105CDB"
              style={{
                width: "100%",
                borderRadius: 8,
                marginBottom: isIos ? 0 : 16,
                marginTop: 8
              }}
              contentStyle={{
                height: 52,
              }}
              onPress={async () => {
                const response = await signIn(email, password)
                if (response.code === -1) {
                  router.push({
                    pathname: '/verify-account',
                    params: {
                      email,
                      code: '-1'
                    }
                  })
                }
                if (typeof response === 'boolean' && response) router.push('/(homeTabs)')
              }}
            >
              Login
            </Button>


            {/*<Button*/}
            {/*  mode="contained"*/}
            {/*  buttonColor="#105CDB"*/}
            {/*  style={{*/}
            {/*    width: "100%",*/}
            {/*    borderRadius: 8,*/}
            {/*    marginBottom: isIos ? 0 : 16,*/}
            {/*  }}*/}
            {/*  contentStyle={{*/}
            {/*    height: 52,*/}
            {/*  }}*/}
            {/*  onPress={async () => {*/}
            {/*    // router.push('/register')*/}
            {/*    router.push('/forgot-password')*/}
            {/*  }}*/}
            {/*>*/}
            {/*  Forgot Password*/}
            {/*</Button>*/}

            <View style={{flexDirection: 'row', gap: 4, alignSelf: 'center', marginTop: 8}}>
              <Text>
                Don’t have an account?
              </Text>
              <TouchableOpacity onPress={() => {
                router.push('/register')
              }}>
                <Text
                  style={{
                    color: '#006EE9'
                  }}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 260,
  },
});
