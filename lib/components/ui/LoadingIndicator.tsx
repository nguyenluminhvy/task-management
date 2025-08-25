import {View} from "react-native";
import React from "react";
import {useAuth} from "@/lib/context/AuthContext";
import {ActivityIndicator} from "react-native-paper";

export function LoadingIndicator() {
  const {loading} = useAuth()

  if (!loading) return null

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.17)' }}>
      <ActivityIndicator size={30} animating={true} color={'#105CDB'} />
    </View>
  );
}
