import { View, Text, StyleSheet } from "react-native";
import colors from "../config/colors";
import React, { useCallback, useRef } from "react";
import AppText from "../components/AppText/AppText";
import { TextInput } from "react-native-gesture-handler";
import useTaskStore from "../store/TaskStore";
import {
  BottomSheetScrollView,
  TouchableHighlight,
} from "@gorhom/bottom-sheet";
import TimeButton from "../components/AppText/TimeButton";
import IconButton from "../components/IconButton";

export default function AddTaskScreen({ handleClosePress }) {
  const {
    taskInput,
    taskHours,
    taskMinutes,
    setTaskInput,
    setTaskHours,
    setTaskMinutes,
    addTask,
  } = useTaskStore((state) => ({
    taskInput: state.taskInput,
    taskHours: state.taskHours,
    taskMinutes: state.taskMinutes,
    setTaskInput: state.setTaskInput,
    setTaskHours: state.setTaskHours,
    setTaskMinutes: state.setTaskMinutes,
    addTask: state.addTask,
  }));

  const incrementTime = (minutes) => {
    const totalMinutes = taskMinutes + minutes;
    setTaskMinutes(totalMinutes);
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight>
        <IconButton iconName="check" onPress={addTask} />
      </TouchableHighlight>
      <TextInput
        style={styles.textInput}
        placeholder="Task"
        value={taskInput}
        onChangeText={setTaskInput}
      />
      <View style={styles.timeInputs}>
        <TextInput
          keyboardType="numeric"
          style={styles.numberLayout}
          placeholder="Hours"
          value={taskHours.toString()}
          onChangeText={(text) => setTaskHours(Number(text))}
        />
        <TextInput
          keyboardType="numeric"
          style={styles.numberLayout}
          placeholder="Minutes"
          value={taskMinutes.toString()}
          onChangeText={(text) => setTaskMinutes(Number(text))}
        />
      </View>
      <View style={styles.presetTimeButtons}>
        <TimeButton time={1} onPress={() => incrementTime(1)} />
        <TimeButton time={5} onPress={() => incrementTime(5)} />
        <TimeButton time={15} onPress={() => incrementTime(15)} />
        <TimeButton time={30} onPress={() => incrementTime(30)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    width: "90%",
    alignItems: "center",
  },
  numberLayout: {
    borderWidth: 2,
    textAlign: "center",
    borderColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 10,
    fontSize: 14,
    marginRight: 20,
    marginBottom: 10,
  },
  presetTimeButtons: {
    flexDirection: "row",
  },
  textInput: {
    borderWidth: 2,
    borderColor: colors.black,
    textAlign: "center",
    width: "90%",
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    fontSize: 20,
  },
  timeInputs: {
    flexDirection: "row",
  },
});
