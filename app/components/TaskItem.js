import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { shallow } from "zustand/shallow"; // Import shallow

import { FontAwesome5 } from "@expo/vector-icons";

import colors from "../config/colors";
import AppText from "./AppText/AppText";
import useTaskStore from "../store/TaskStore";

function TaskItem({ taskId, style }) {
  const [secondsLeft, setSecondsLeft] = useState(null);
  const intervalRef = useRef(null);

  const task = useTaskStore((state) =>
    state.tasks.find((t) => t.id === taskId)
  );

  useEffect(() => {
    if (task && task.timerActive) {
      setSecondsLeft(task.remainingSeconds);
    }
  }, [task]);

  // Manage countdown
  useEffect(() => {
    if (task && task.timerActive && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [task, task?.timerActive, secondsLeft]);

  // Handle task completion
  useEffect(() => {
    if (secondsLeft === 0) {
      useTaskStore.getState().updateTaskCompletion(taskId);
    }
  }, [secondsLeft, taskId]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m:${remainingSeconds}s`;
  };

  if (!task) {
    return (
      <View style={styles.taskContainer}>
        <AppText style={styles.taskText}>Task not found or deleted.</AppText>
      </View>
    );
  }

  const displayTime =
    secondsLeft !== null ? formatTime(secondsLeft) : "Loading...";

  return (
    <View style={[styles.taskContainer, style]}>
      <View>
        <AppText style={styles.taskText}>{task.text}</AppText>
      </View>
      <View style={styles.time}>
        <FontAwesome5 name="tasks" size={20} color="black" />
        <AppText style={styles.taskText}>{displayTime}</AppText>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  taskContainer: {
    paddingLeft: 10,

    marginVertical: 8,
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
  // taskContainer: {
  //   borderRadius: 40,
  //   backgroundColor: colors.taskItemPrimary,
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   padding: 15,
  //   width: "100%",
  //   height: "auto",
  //   flexDirection: "row",
  //   marginTop: 10,
  // },
  taskText: {
    color: colors.black,
    fontSize: 24,
  },
  time: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TaskItem;
