import {View} from "react-native";
import React, {useState} from "react";
import {router, useRouter} from "expo-router";
import {Button, Text} from "react-native-paper";
import {useAuth} from "@/lib/context/AuthContext";
import {AppTextInput} from "@/lib/components/ui/AppTextInput";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";
import {validateEmail} from "@/lib/utils/validators";
import {getFirebaseAdminErrorMessage} from "@/lib/utils/firebaseAdminErrors";

export default function Index() {
  const { push } = useRouter();
  const { signUp } = useAuth()

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
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
    passwordConfirm: string
  ): Promise<boolean> => {
    let message = ''

    if (password !== passwordConfirm) {
      message = "Passwords do not match.";
    }

    if (password.length < 8) {
      message = "Password must be at least 8 characters long.";
    }

    if (!password || !passwordConfirm) {
      message = "Password and confirm password are required.";
    }

    if (message) {
      setPasswordErrorMessage(message);
    } else {
      setPasswordErrorMessage('');
    }

    return !message;
  };

  const onRegister = async () => {
    const isValid = await isValidEmail(email) && await isValidatePassword(password, confirmPassword)

    if (!isValid) return

    try {
      await signUp(email, password)
      push({
        pathname: '/verify-account',
        params: {
          email
        }
      })
    } catch (e) {
      const errorMessage = getFirebaseAdminErrorMessage(e?.code)
      setErrorMessage(errorMessage)
    }
  }

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
            />
            <AppTextInput
              autoCapitalize="none"
              placeholder="Confirm Password"
              value={confirmPassword}
              secureTextEntry
              onChangeText={(value) => {
                setConfirmPassword(value.trim())
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
              onPress={onRegister}
            >
              Register
            </Button>

          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

