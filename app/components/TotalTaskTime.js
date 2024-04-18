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

  const calculateFutureTime = () => {
    const totalSeconds = calculateTotalSeconds();
    const currentTime = new Date();
    const futureTime = new Date(currentTime.getTime() + totalSeconds * 1000);
    return futureTime.toLocaleTimeString();
  };

  const futureTime = calculateFutureTime();

  return (
    <View style={styles.container}>
      <View style={styles.detail}>
        <Header style={styles.header}>Total: </Header>
        <AppText style={styles.text}>{totalTime}</AppText>
      </View>
      <View style={styles.detail}>
        <Header style={styles.header}>Finish Time: </Header>
        <AppText style={styles.text}>{futureTime}</AppText>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    color: colors.gold,
    fontSize: 12,
  },
  text: {
    color: colors.platinumWhite,
    fontSize: 10,
    textAlign: "center",
  },
});
