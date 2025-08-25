import {StyleSheet, TextInput, View} from "react-native";
import {useState} from "react";
import {useRouter} from "expo-router";
import {isIos} from "@/lib/utils/helper";
import {SafeAreaView} from "react-native-safe-area-context";
import {Button, Text} from "react-native-paper";
import {useAuth} from "@/lib/context/AuthContext";
import {AppTextInput} from "@/lib/components/ui/AppTextInput";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";

export default function Index() {
  const { push } = useRouter();
  const { signUp } = useAuth()

  const [email, setEmail] = useState<string>('vyuser003@yopmail.com');
  const [password, setPassword] = useState<string>('123456');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
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
            paddingTop: 40
          }}>
            <Text
              variant="titleSmall"
              style={{
                textAlign: "center",
                marginBottom: 20
              }}
            >
              Create your account
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
            <AppTextInput
              autoCapitalize="none"
              placeholder="Email"
              value={confirmPassword}
              secureTextEntry
              onChangeText={(value) => {
                setConfirmPassword(value.trim())
              }}
            />


            <Button
              mode="contained"
              buttonColor="#105CDB"
              style={{
                width: "100%",
                borderRadius: 8,
                marginTop: 16,
              }}
              contentStyle={{
                height: 52,
              }}
              onPress={async () => {
                await signUp(email, password)
                push({
                  pathname: '/verify-account',
                  params: {
                    email
                  }
                })
              }}
            >
              Register
            </Button>

          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

