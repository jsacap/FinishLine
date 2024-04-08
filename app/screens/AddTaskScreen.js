import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, Dimensions, Text } from "react-native";
import AppText from "../components/AppText/AppText";

import colors from "../config/colors";
import IconButton from "../components/IconButton";
import { Header } from "react-native/Libraries/NewAppScreen";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Toast from "react-native-toast-message";
import TimeButton from "../components/AppText/TimeButton";

function AddTaskScreen({
  task = null, // Default task is null for new task
  onTaskSubmit,
  onTaskCancel,
}) {
  const [taskName, setTaskName] = useState(task?.name || "");
  const [hours, setHours] = useState(
    task ? Math.floor(task.durationMinutes / 60).toString() : ""
  );
  const [minutes, setMinutes] = useState(
    task ? (task.durationMinutes % 60).toString() : ""
  );

  const handleTimeIncrement = (addedMinutes) => {
    const totalMinutes = parseInt(minutes || "0", 10) + addedMinutes;
    const totalHours =
      parseInt(hours || "0", 10) + Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;

    setHours(totalHours.toString());
    setMinutes(newMinutes.toString());
  };

  const handleSubmit = async () => {
    if (!taskName || (!hours && !minutes)) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill all the fields.",
      });
      return;
    }

    const durationMinutes =
      parseInt(hours || "0", 10) * 60 + parseInt(minutes || "0", 10);

    const newTask = {
      id: task?.id || new Date().getTime().toString(),
      name: taskName,
      durationMinutes,
    };

    onTaskSubmit(newTask);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        onChangeText={setTaskName}
        value={taskName}
        placeholder="Task Name"
      />
      <AppText>Estimated Time Duration</AppText>
      <View style={styles.timeInputs}>
        <TextInput
          style={styles.numberLayout}
          onChangeText={(text) => setHours(text)}
          value={hours}
          keyboardType="numeric"
          placeholder="Hours"
        />
        <Text style={styles.semicolon}>:</Text>

        <TextInput
          style={styles.numberLayout}
          onChangeText={(text) => setMinutes(text)}
          value={minutes}
          keyboardType="numeric"
          placeholder="Minutes"
        />
      </View>
      <View style={styles.presetTimeButtons}>
        <TimeButton time={1} onPress={() => handleTimeIncrement(1)} />
        <TimeButton time={5} onPress={() => handleTimeIncrement(5)} />
        <TimeButton time={15} onPress={() => handleTimeIncrement(15)} />
        <TimeButton time={30} onPress={() => handleTimeIncrement(30)} />
      </View>
      <View style={styles.buttons}>
        <IconButton
          style={styles.cancelButton}
          iconName="arrow-left"
          onPress={onTaskCancel}
        />
        <IconButton iconName="check" onPress={handleSubmit} />
      </View>
    </View>
  );
}
const width = Dimensions.get("window").width - 50;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    borderWidth: 2,
    borderColor: colors.primary,
    width,
    height: 50,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 20,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "gray",
    marginRight: 20,
    width: 50,
  },
  submitButton: {
    backgroundColor: "gray",
    marginRight: 20,
    width: 50,
  },
  deleteButton: {
    backgroundColor: colors.secondary,
    margin: 20,
  },
  buttons: {
    flexDirection: "row",
  },
  numberLayout: {
    borderWidth: 2,
    borderColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  timeInputs: {
    flexDirection: "row",
    fontSize: 50,
  },
  semicolon: {
    fontWeight: "bold",
    fontSize: 30,
    marginRight: 20,
  },
  presetTimeButtons: {
    flexDirection: "row",
  },
});

export default AddTaskScreen;
