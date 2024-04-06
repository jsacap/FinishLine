import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function TimeButton({ time }) {
  return (
    <View style={styles.container}>
      <Text>+{time} mins</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
