import { View, Text, StyleSheet, Button } from "react-native";
import React, { useEffect, useState } from "react";
import useTaskStore from "../store/TaskStore";

export default function SandBox() {
  const { tasks } = useTaskStore((state) => ({
    tasks: state.tasks.filter((task) => task.taskStatus === "incomplete"),
  }));

  // Local state to manage the timer and remaining seconds
  const [timerOn, setTimerOn] = useState(false);

  const [remainingSeconds, setRemainingSeconds] = useState(
    tasks[0]?.remainingSeconds || 0
  );

  useEffect(() => {
    let interval = null;

    if (timerOn) {
      interval = setInterval(() => {
        setRemainingSeconds((prevSeconds) => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          } else {
            clearInterval(interval);
            return 0;
          }
        });
      }, 1000);
    } else if (!timerOn && interval !== null) {
      clearInterval(interval);
    }

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [timerOn]);

  const startTimer = () => {
    setTimerOn(true);
  };

  const stopTimer = () => {
    setTimerOn(false);
  };

  const futureTime = () => {};
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{tasks[0]?.text || "No Task"}</Text>
      <Text style={styles.text}>
        Duration Seconds: {tasks[0]?.durationSeconds}
      </Text>
      <Text style={styles.text}>Remaining Seconds: {remainingSeconds}</Text>
      <Button title="Start" onPress={startTimer} />
      <Button title="Stop" onPress={stopTimer} />
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
  header: {
    color: "#ccc",
    fontSize: 40,
  },
  text: {
    color: "#ccc",
    fontSize: 15,
  },
});
