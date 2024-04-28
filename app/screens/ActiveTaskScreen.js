import { View, Text, StyleSheet, Dimensions, Button } from "react-native";
import React, { useEffect } from "react";
import useTaskStore from "../store/TaskStore";
import PlayButton from "../components/PlayButton";
import IconButton from "../components/IconButton";
import { useNavigation } from "@react-navigation/native";
import TimeCompletion from "../components/TimeCompletion";
import TimeButton from "../components/AppText/TimeButton";
import Header from "../components/Header";
import AppText from "../components/AppText/AppText";
import colors from "../config/colors";

export default function ActiveTaskScreen() {
  const navigation = useNavigation();

  const {
    tasks,
    activeTaskId,
    intervalId,
    isPaused,
    startTimer,
    pauseTimer,
    completionTime,
    incrementTaskTime,
  } = useTaskStore((state) => ({
    tasks: state.tasks,
    activeTaskId: state.activeTaskId,
    intervalId: state.intervalId,
    isPaused: state.isPaused,
    togglePause: state.togglePause,
    completionTime: state.completionTime,
    puaseTimer: state.pauseTimer,
    startTimer: state.startTimer,
    incrementTaskTime: state.incrementTaskTime,
  }));

  const task = tasks.find((t) => t.id === activeTaskId);

  if (!task) {
    return (
      <View style={styles.taskContainer}>
        <Text style={styles.taskText}>No Active Task</Text>
        <Button
          title="Go Back"
          onPress={() => navigation.navigate("TaskList")}
        />
      </View>
    );
  }

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

  const displayTime = task.timerActive
    ? formatTime(task.remainingSeconds)
    : formatDuration(task.durationMinutes);

  const completionTimeFormatted = completionTime
    ? new Date(completionTime).toLocaleTimeString()
    : "";

  const incrementTimes = [1, 5, 15, 30];

  return (
    <View style={styles.container}>
      <View style={styles.backButton}>
        <IconButton iconName="arrow-left" onPress={() => navigation.goBack()} />
      </View>
      <Header style={styles.header}>{task.text}</Header>
      <AppText>Finish Time: {completionTimeFormatted}</AppText>
      <PlayButton taskId={task.id} />
      <AppText style={styles.timer}>{displayTime}</AppText>

      <View style={styles.buttonContainer}>
        {incrementTimes.map((time) => (
          <TimeButton
            key={time}
            time={`${time}`}
            onPress={() => incrementTaskTime(time)}
          />
        ))}
      </View>
    </View>
  );
}
const window = Dimensions.get("window");
const circleDiameter = Math.min(window.width, window.height * 0.3);
const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 0,
    left: 0,
    padding: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    padding: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  timer: {
    fontSize: 26,
    color: "navy",
  },
  taskContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  taskText: {
    fontSize: 16,
    color: "red",
  },
});
