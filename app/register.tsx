import {StyleSheet, TextInput, View} from "react-native";
import {useState} from "react";
import {useRouter} from "expo-router";
import {isIos} from "@/lib/utils/helper";
import {SafeAreaView} from "react-native-safe-area-context";
import {Button, Text} from "react-native-paper";
import {useAuth} from "@/lib/context/AuthContext";

export default function Index() {
  const { replace } = useRouter();
  const { signUp } = useAuth()

  const [email, setEmail] = useState<string>('vyuser003@yopmail.com');
  const [password, setPassword] = useState<string>('123456');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

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
          <Text
            variant="titleSmall"
            style={{
              textAlign: "center",
              marginBottom: 20
            }}
          >
            Create your account
          </Text>


          <TextInput
            autoCapitalize="none"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
          <TextInput
            autoCapitalize="none"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={{ borderBottomWidth: 1, marginBottom: 20 }}
          />
          <TextInput
            autoCapitalize="none"
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={{ borderBottomWidth: 1, marginBottom: 20 }}
          />

          <Button
            mode="contained"
            buttonColor="#105CDB"
            style={{
              width: "100%",
              borderRadius: 8,
              marginBottom: isIos ? 0 : 16,
            }}
            contentStyle={{
              height: 52,
            }}
            onPress={async () => {
              await signUp(email, password)
              replace({
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 260,
  },
});
