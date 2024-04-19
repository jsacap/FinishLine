import { View, Text, StyleSheet, Button } from "react-native";
import React, { useEffect } from "react";
import useTaskStore from "../store/TaskStore";
import PlayButton from "../components/PlayButton";

export default function ActiveTaskScreen() {
  const { tasks, activeTaskId, intervalId, isPaused, startTimer, pauseTimer } =
    useTaskStore((state) => ({
      tasks: state.tasks,
      activeTaskId: state.activeTaskId,
      intervalId: state.intervalId,
      isPaused: state.isPaused,
      togglePause: state.togglePause,
      puaseTimer: state.pauseTimer,
      startTimer: state.startTimer,
    }));

  const task = tasks.find((t) => t.id === activeTaskId);

  useEffect(() => {
    // This effect ensures the component updates every second if the task's timer is active
    if (task && task.timerActive && intervalId) {
      const interval = setInterval(() => {
        // Force update component every second to reflect the countdown
        useTaskStore.getState().pauseTimer(); // Temporarily trigger a state change
        useTaskStore.getState().resumeTimer(task.id);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [task, intervalId]);

  if (!task) {
    return (
      <View style={styles.taskContainer}>
        <Text style={styles.taskText}>Task not found or deleted.</Text>
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{task.text}</Text>
      <PlayButton taskId={task.id} />
      <Text style={styles.timer}>{displayTime}</Text>
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  timer: {
    fontSize: 20,
    color: "blue",
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
