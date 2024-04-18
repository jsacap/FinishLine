import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Header from "./Header";
import AppText from "./AppText/AppText";
import colors from "../config/colors";

export default function TotalTaskTime({ tasks }) {
  const calculateTotalSeconds = () => {
    return tasks.reduce((acc, task) => acc + task.durationSeconds, 0);
  };

  // Format total time for display
  const calculateTotalTime = () => {
    const totalSeconds = calculateTotalSeconds();
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const totalTime = calculateTotalTime();

  // Calculate future time when tasks will be completed
  const calculateFutureTime = () => {
    const totalSeconds = calculateTotalSeconds(); // Reuse the total seconds calculation
    const currentTime = new Date();
    const futureTime = new Date(currentTime.getTime() + totalSeconds * 1000);
    return futureTime.toLocaleTimeString(); // Make sure to call the function here
  };

  const futureTime = calculateFutureTime();

  return (
    <View style={styles.container}>
      <View>
        <Header style={styles.header}>Total Time</Header>
        <AppText style={styles.text}>{totalTime}</AppText>
      </View>
      <View>
        <Header style={styles.header}>Estimated Completion Time</Header>
        <AppText style={styles.text}>{futureTime}</AppText>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    color: "gold",
  },
  text: {
    color: colors.platinumWhite,

    textAlign: "center",
  },
});
