import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

export default function TimeButton({ time, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text>+{time} mins</Text>
    </TouchableOpacity>
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
