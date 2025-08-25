import { StyleSheet, View } from "react-native";
import {ActivityIndicator, Button, Text} from "react-native-paper";

import { Image } from "expo-image";
import { IMAGES } from "@/lib/assets/images";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { isIos } from "@/lib/utils/helper";
import {useEffect, useState} from "react";
import {getAuth, onAuthStateChanged} from "firebase/auth";

export default function Index() {
  const { push, navigate } = useRouter();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const auth = getAuth();
    const subscriber = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        navigate('/(homeTabs)')
      } else {
        setLoading(false)
      }
    });

    // Unsubscribe on unmount to prevent memory leaks
    return subscriber;
  }, []); // Empty dependency array ensures it runs once on mount

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 }}>
        <ActivityIndicator size={'large'} animating={true} color={'#105CDB'} />
        <Text variant="titleSmall">Loading</Text>
    </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 16,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Image
            style={styles.image}
            source={IMAGES.welcome}
            contentFit="contain"
            transition={500}
          />
          <Text variant="headlineSmall">Easy Time Management</Text>

          <Text
            style={{
              textAlign: "center",
              paddingHorizontal: 20,
            }}
          >
            With management based on priority and daily tasks, it will give you
            convenience in managing and determining the tasks that must be done
            first
          </Text>
        </View>

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
          onPress={() => {
            navigate("/login");
          }}
        >
          Get Started
        </Button>
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
