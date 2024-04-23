import { View, Text, StyleSheet, Button } from "react-native";
import React, { useEffect, useState } from "react";

export default function SandBox() {
  const [secondsLeft, setSecondsLeft] = useState(3600);
  const [timerOn, setTimerOn] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>SandBox</Text>
      <Button title="Start" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  text: {
    color: "#ccc",
    fontSize: 40,
  },
});
