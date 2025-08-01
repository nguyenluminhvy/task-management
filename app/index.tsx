import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

import { Image } from "expo-image";
import { IMAGES } from "@/lib/assets/images";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { isIos } from "@/lib/utils/helper";

export default function Index() {
  const { push } = useRouter();

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
            push("/login");
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
