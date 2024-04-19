import { View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import useTaskStore from "../store/TaskStore";
import { AntDesign } from "@expo/vector-icons";
import colors from "../config/colors";

export default function PlayButton({ navigation, taskId }) {
  const { isPaused, togglePause, startTimer, pauseTimer } = useTaskStore(
    (state) => ({
      isPaused: state.isPaused,
      togglePause: state.togglePause,
      startTimer: state.startTimer,
      pauseTimer: state.pauseTimer,
    })
  );

  const handleToggleTimer = () => {
    if (taskId) {
      if (isPaused) {
        startTimer(taskId);
        togglePause();
        if (navigation) {
          navigation.navigate("ActiveTask");
        }
      } else {
        pauseTimer();
        togglePause();
      }
    }
  };
  return (
    <TouchableOpacity onPress={handleToggleTimer} style={styles.button}>
      <AntDesign
        name={isPaused ? "play" : "pause"}
        size={50}
        color={colors.gold}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 25,
  },
});
