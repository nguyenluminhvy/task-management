import {StyleSheet, TouchableOpacity, View} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import {Image} from "expo-image";
import {IMAGES} from "@/lib/assets/images";
import {SafeAreaView} from "react-native-safe-area-context";
import {Button, Text} from "react-native-paper";
import {useAuth} from "@/lib/context/AuthContext";

export default function Index() {
  const { email, code } = useLocalSearchParams();
  const { navigate } = useRouter();
  const { reSendEmailVerification } = useAuth();

  const isNotVerify = code === '-1'
  const isForgotPassword = code === '-2'

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
            alignItems: "center"
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
            {isForgotPassword ? 'Reset Password' : 'Verify Account'}
          </Text>

          <Image
            style={styles.image}
            source={IMAGES.bro}
            contentFit="contain"
            transition={500}
          />

          <View>

            {
              isForgotPassword ? (
                <View>
                  <Text
                    variant="labelSmall"
                    style={{
                      textAlign: "center",
                      marginTop: 20,
                      paddingHorizontal: 70
                    }}
                  >
                    {`We has send the email to ${email}`}
                  </Text>
                  <Text
                    variant="labelSmall"
                    style={{
                      textAlign: "center",
                      marginTop: 4,
                      paddingHorizontal: 40
                    }}
                  >
                    Please follow email instructions to reset your password
                  </Text>
                </View>
              ) : (
                <View>
                  <Text
                    variant="labelSmall"
                    style={{
                      textAlign: "center",
                      marginTop: 20,
                      paddingHorizontal: 70
                    }}
                  >
                    {
                      isNotVerify ? 'Your account is not verified' : `We has send the verification email to ${email}`
                    }

                  </Text>

                  <Text
                    variant="labelSmall"
                    style={{
                      textAlign: "center",
                      marginTop: 4,
                      paddingHorizontal: 70
                    }}
                  >
                    Please check email to verify your account
                  </Text>
                </View>
              )
            }

            {
              !isForgotPassword && (
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 4,
                  marginTop: 4,
                  marginBottom: 20,

                }}>
                  <Text
                    variant="labelSmall"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    Didn't receive verification email?
                  </Text>
                  <TouchableOpacity onPress={reSendEmailVerification}>
                    <Text
                      variant="labelMedium"
                      style={{
                        textAlign: "center",
                        color: '#105CDB',
                      }}
                    >
                      Resend
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            }


          </View>

          <Button
            mode="contained"
            buttonColor="#105CDB"
            style={{
              width: "100%",
              borderRadius: 8,
              marginTop: 24,
            }}
            contentStyle={{
              height: 52,
            }}
            onPress={async () => {
              navigate('/login')
            }}
          >
            Go to Login
          </Button>

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 200,
  },
});
