import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import Header from "./Header";
import AppText from "./AppText/AppText";
import colors from "../config/colors";
import useTaskStore from "../store/TaskStore";

export default function TotalTaskTime({ tasks }) {
  const totalCompletionTime = useTaskStore(
    (state) => state.totalCompletionTime
  );

  const [totalTime, setTotalTime] = useState("");

  useEffect(() => {
    const totalSeconds = tasks.reduce(
      (acc, task) => acc + task.durationSeconds,
      0
    );

    // Calculate total time
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    setTotalTime(`${hours}h ${minutes}m`);

    // Calculate future time
    const currentTime = new Date();
  }, [tasks]);

  return (
    <View style={styles.container}>
      <View style={styles.detail}>
        <Text style={styles.header}>Total: {totalTime}</Text>
      </View>
      <View style={styles.detail}>
        <Text style={styles.header}>
          Finish Time: {totalCompletionTime?.toLocaleTimeString()}
        </Text>
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
