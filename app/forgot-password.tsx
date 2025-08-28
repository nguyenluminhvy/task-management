import {StyleSheet, TextInput, View} from "react-native";
import {useAuth} from "@/lib/context/AuthContext";
import {useState} from "react";
import {router, useRouter} from "expo-router";
import {isIos} from "@/lib/utils/helper";
import {SafeAreaView} from "react-native-safe-area-context";
import {Button, Text} from "react-native-paper";
import {AppTextInput} from "@/lib/components/ui/AppTextInput";
import {validateEmail} from "@/lib/utils/validators";
import {getFirebaseAdminErrorMessage} from "@/lib/utils/firebaseAdminErrors";

export default function Index() {
  const { replace } = useRouter();
  const { sendEmailResetPassword} = useAuth()

  const [email, setEmail] = useState<string>('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
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

  const onContinue = async () => {
    const isValid = await isValidEmail(email)

    if (!isValid) return

    try {
      await sendEmailResetPassword(email)
      replace({
        pathname: '/verify-account',
        params: {
          email,
          code: '-2'
        }
      })
    } catch (e) {
      const errorMessage = getFirebaseAdminErrorMessage(e?.code)
      setErrorMessage(errorMessage)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1,  }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 16,
        }}
      >
        <View
          style={{
            alignItems: "center",
            marginTop: 28,
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
          <View>
            <Text
              variant="titleSmall"
              style={{
                textAlign: "center",
              }}
            >
              Forgot your password?
            </Text>
            <Text
              variant="labelMedium"
              style={{
                textAlign: "center",
                marginBottom: 20,
                paddingHorizontal: 50
              }}
            >
              Enter your email and we will send you instructions to reset your password
            </Text>
          </View>


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


          <Button
            mode="contained"
            buttonColor="#105CDB"
            style={{
              width: "100%",
              borderRadius: 8,
              marginBottom: isIos ? 0 : 16,
              marginTop: 16,
            }}
            contentStyle={{
              height: 52,
            }}
            onPress={onContinue}
          >
            Continue
          </Button>

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 260,
  },
});
