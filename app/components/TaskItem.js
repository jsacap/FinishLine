import React from "react";
import { StyleSheet, View } from "react-native";

import { FontAwesome5 } from "@expo/vector-icons";

import colors from "../config/colors";
import AppText from "./AppText/AppText";

function TaskItem({ title, time, remainingTime }) {
  const displayTime = `${Math.floor(remainingTime / 3600)}h:${Math.floor(
    (remainingTime % 3600) / 60
  )}m`;

  return (
    <View style={styles.taskContainer}>
      <View>
        <AppText style={styles.taskText}>{title}</AppText>
      </View>
      <View style={styles.time}>
        <FontAwesome5 name="tasks" size={20} color="black" />
        {remainingTime ? (
          <AppText>{remainingTime}</AppText>
        ) : (
          <AppText>{time}</AppText>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  taskContainer: {
    borderRadius: 40,
    backgroundColor: "#46c2e8",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    width: "90%",
    height: "auto",
    flexDirection: "row",
    marginTop: 10,
  },
  taskText: {
    color: colors.white,
    fontSize: 24,
  },
  time: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TaskItem;
