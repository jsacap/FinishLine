import React, { useEffect, useState } from "react";
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
  onTaskSubmit,
  onTaskCancel,
  tasks,
  setTasks,
  toggleBottomSheet,
}) {
  const [taskName, setTaskName] = useState(task?.name || "");
  const [taskStatus, setTaskStatus] = useState(
    task?.taskStatus || "incomplete"
  );
  const [hours, setHours] = useState(
    task ? Math.floor(task.durationMinutes / 60).toString() : ""
  );
  const [minutes, setMinutes] = useState(
    task ? (task.durationMinutes % 60).toString() : ""
  );
  const fetchExistingTasks = async () => {
    const tasksString = await AsyncStorage.getItem("tasks");
    return tasksString ? JSON.parse(tasksString) : [];
  };
  useEffect(() => {
    setTaskName(task?.name || "");
    if (task?.isCurrentTask && task?.remainingTime != null) {
      const hours = Math.floor(task.remainingTime / 3600);
      const minutes = Math.floor((task.remainingTime % 3600) / 60);
      setHours(hours.toString());
      setMinutes(minutes.toString());
    } else {
      setHours(task ? Math.floor(task.durationMinutes / 60).toString() : "");
      setMinutes(task ? (task.durationMinutes % 60).toString() : "");
    }
  }, [task]);

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
      taskStatus: task?.taskStatus || "incomplete",
    };

    onTaskSubmit(newTask);
    Toast.show({
      type: "success",
      text1: task?.id ? "Task Edited Successfully" : "Task Added",
      position: "bottom",
    });
  };

  const handleDeleteTask = () => {
    if (task?.id && onTaskDelete) {
      onTaskDelete(task.id);
      Toast.show({
        type: "success",
        text1: "Task Deleted",
        position: "bottom",
      });
    }
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
        {task && (
          <IconButton
            style={styles.deleteButton}
            iconName="trash-alt"
            onPress={() =>
              handleTaskDelete(
                task.id,
                tasks,
                setTasks,
                () => {},
                toggleBottomSheet
              )
            }
          />
        )}
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
          onChangeText={(text) => setHours(text)}
          value={hours}
          keyboardType="numeric"
          placeholder="HH"
        />
        <Text style={styles.semicolon}>:</Text>

        <TextInput
          style={styles.numberLayout}
          onChangeText={(text) => setMinutes(text)}
          value={minutes}
          keyboardType="numeric"
          placeholder="mm"
        />
      </View>
      <View style={styles.presetTimeButtons}>
        <TimeButton time={1} onPress={() => handleTimeIncrement(1)} />
        <TimeButton time={5} onPress={() => handleTimeIncrement(5)} />
        <TimeButton time={15} onPress={() => handleTimeIncrement(15)} />
        <TimeButton time={30} onPress={() => handleTimeIncrement(30)} />
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
