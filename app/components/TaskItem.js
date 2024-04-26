import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { FontAwesome5 } from "@expo/vector-icons";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "./AppText/AppText";
import useTaskStore from "../store/TaskStore";

function TaskItem({ taskId, style }) {
  const { updateTaskCompletion } = useTaskStore((state) => ({
    updateTaskCompletion: state.updateTaskCompletion,
  }));

  const task = useTaskStore((state) =>
    state.tasks.find((t) => t.id === taskId)
  );

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m:${remainingSeconds}s`;
  };

  const formatDuration = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    let timeString = "";
    if (hours > 0) {
      timeString += `${hours} hr${hours === 1 ? "" : "s"}`;
    }
    if (minutes > 0) {
      if (timeString.length > 0) timeString += " ";
      timeString += `${minutes} min${minutes === 1 ? "" : "s"}`;
    }
    return timeString;
  };

  if (!task) {
    return (
      <View style={styles.taskContainer}>
        <AppText style={styles.taskText}>Task not found or deleted.</AppText>
      </View>
    );
  }

  const displayTime = task.timerActive
    ? formatTime(task.remainingSeconds)
    : formatDuration(task.durationMinutes);

  return (
    <View style={[styles.taskContainer, style]}>
      <View>
        <AppText style={styles.taskText}>{task.text}</AppText>
      </View>
      <View style={styles.time}>
        <MaterialCommunityIcons
          name={task.iconName || "check"}
          size={24}
          color="black" // Set the icon color
        />
        <AppText style={styles.taskText}>{displayTime}</AppText>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  taskContainer: {
    paddingLeft: 10,
    paddingRight: 10,

    marginVertical: 2,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: colors.taskItemPrimary,
  },
  taskText: {
    color: colors.black,
    fontSize: 14,
  },
  time: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TaskItem;
