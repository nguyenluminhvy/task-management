import {StyleSheet, TouchableOpacity, View} from "react-native";
import {useAuth} from "@/lib/context/AuthContext";
import React, {useState} from "react";
import {router} from "expo-router";
import {isIos} from "@/lib/utils/helper";
import {SafeAreaView} from "react-native-safe-area-context";
import {Button, Text} from "react-native-paper";
import {AppTextInput} from "@/lib/components/ui/AppTextInput";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";
import {validateEmail} from "@/lib/utils/validators";
import {getFirebaseAdminErrorMessage} from "@/lib/utils/firebaseAdminErrors";

export default function Index() {
  const { signIn } = useAuth()

  const [email, setEmail] = useState<string>('vyuser005@yopmail.com');
  const [password, setPassword] = useState<string>('12345678');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isValidEmail = async (value: any): Promise<boolean> => {
    const message = validateEmail(value);

    if (message) {
      setEmailErrorMessage(message);
    } else {
      setEmailErrorMessage('');
    }

    return !message
  }

  const isValidatePassword = async (
    password: string,
  ): Promise<boolean> => {
    let message = ''

    if (!password) {
      message = "Password is required.";
    }

    if (password.length < 8) {
      message = "Password must be at least 8 characters long.";
    }

    if (message) {
      setPasswordErrorMessage(message);
    } else {
      setPasswordErrorMessage('');
    }

    return !message;
  };

  const onLogin = async () => {
    const isValid = await isValidEmail(email) && await isValidatePassword(password)

    if (!isValid) return

    try {
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
    } catch (e) {
      const errorMessage = getFirebaseAdminErrorMessage(e?.code)
      setErrorMessage(errorMessage)
    }
  }

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
                if (emailErrorMessage) setEmailErrorMessage('')
                if (errorMessage) setErrorMessage('')
              }}
              isError={!!emailErrorMessage}
              errorMessage={emailErrorMessage}
            />
            <AppTextInput
              autoCapitalize="none"
              placeholder="Password"
              value={password}
              secureTextEntry
              onChangeText={(value) => {
                setPassword(value.trim())
                if (passwordErrorMessage) setPasswordErrorMessage('')
                if (errorMessage) setErrorMessage('')
              }}
              isError={!!passwordErrorMessage}
              errorMessage={passwordErrorMessage}
            />

            {
              errorMessage && (
                <Text
                  variant={'labelSmall'}
                  style={{ marginTop: 8, marginLeft: 0, color: 'rgba(234, 57, 67, 1)'}}
                >
                  {errorMessage}
                </Text>
              )
            }

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
              onPress={onLogin}
            >
              Login
            </Button>

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
