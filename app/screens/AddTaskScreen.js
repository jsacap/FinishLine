import React, { useEffect, useState } from "react";
import useTasksStore from "../store/TaskStore";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AppText from "../components/AppText/AppText";

import AsyncStorage from "@react-native-async-storage/async-storage";
import IconButton from "../components/IconButton";
import colors from "../config/colors";

import Toast from "react-native-toast-message";
import TimeButton from "../components/AppText/TimeButton";
import { handleTaskDelete } from "../components/TaskHelper";

function AddTaskScreen({
  task = null,
  onTaskCancel,
  setBottomSheetVisibility,
}) {
  const { addOrUpdateTask } = useTasksStore((state) => ({
    addOrUpdateTask: state.addOrUpdateTask,
  }));
  const [taskName, setTaskName] = useState(task?.name || "");
  const [hours, setHours] = useState(
    task ? Math.floor(task.durationMinutes / 60).toString() : ""
  );
  const [minutes, setMinutes] = useState(
    task ? (task.durationMinutes % 60).toString() : ""
  );

  useEffect(() => {
    if (task) {
      setTaskName(task.name);
      setHours(Math.floor(task.durationMinutes / 60).toString());
      setMinutes((task.durationMinutes % 60).toString());
    }
  }, [task]);

  const handleSubmit = () => {
    if (!taskName || (!hours && !minutes)) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill all the fields.",
      });
      return;
    }
    const durationMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    const newTask = {
      id: task?.id || new Date().getTime().toString(),
      name: taskName,
      durationMinutes,
      taskStatus: task?.taskStatus || "incomplete",
    };

    addOrUpdateTask(newTask);
    Toast.show({
      type: "success",
      text1: task?.id ? "Task Edited Successfully" : "Task Added",
      position: "bottom",
    });
    setBottomSheetVisibility(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <IconButton
          style={styles.cancelButton}
          iconName="angle-left"
          onPress={onTaskCancel}
        />
        <IconButton iconName="check" onPress={handleSubmit} />
      </View>
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
          onChangeText={setHours}
          value={hours}
          keyboardType="numeric"
          placeholder="HH"
        />
        <Text style={styles.semicolon}>:</Text>
        <TextInput
          style={styles.numberLayout}
          onChangeText={setMinutes}
          value={minutes}
          keyboardType="numeric"
          placeholder="mm"
        />
      </View>
      <View style={styles.presetTimeButtons}>
        <TimeButton
          time={1}
          onPress={() => setMinutes((prev) => String(+prev + 1))}
        />
        <TimeButton
          time={5}
          onPress={() => setMinutes((prev) => String(+prev + 5))}
        />
        <TimeButton
          time={15}
          onPress={() => setMinutes((prev) => String(+prev + 15))}
        />
        <TimeButton
          time={30}
          onPress={() => setMinutes((prev) => String(+prev + 30))}
        />
      </View>
    </View>
  );
}
const width = Dimensions.get("window").width - 50;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingBottom: 60,
  },
  textInput: {
    borderWidth: 2,
    borderColor: colors.primary,
    width: "90%",
    height: 50,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 20,
    marginBottom: 10,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "gray",
  },
  submitButton: {
    backgroundColor: "gray",
    marginRight: 20,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    margin: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
    marginBottom: 10,
    justifyContent: "space-evenly",
    width: "70%",
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
  buttonShadow: {},
});

export default AddTaskScreen;
