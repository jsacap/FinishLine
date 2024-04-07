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

function AddTaskScreen({ route }) {
  const navigation = useNavigation();
  const [taskName, setTaskName] = useState("");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [taskId, setTaskId] = useState(null);

  useEffect(() => {
    if (route.params?.task) {
      const task = route.params.task;
      setTaskName(task.name);
      setTaskId(task.id);
      if (route.params.remainingHours && route.params.remainingMinutes) {
        setHours(route.params.remainingHours);
        setMinutes(route.params.remainingMinutes);
      } else {
        const duration = task.durationMinutes;
        setHours(Math.floor(duration / 60).toString());
        setMinutes((duration % 60).toString());
      }
    }
  }, [route.params]);

  const fetchExistingTasks = async () => {
    const tasksString = await AsyncStorage.getItem("tasks");
    return tasksString ? JSON.parse(tasksString) : [];
  };

  const handleSubmit = async () => {
    const hoursNum = parseInt(hours, 10) || 0;
    const minutesNum = parseInt(minutes, 10) || 0;

    if (!taskName.trim() || (hoursNum === 0 && minutesNum === 0)) {
      Toast.show({
        type: "error",
        text1: "Error Adding New Task",
        text2: "Ensure there is a name and time set",
      });
      return;
    }

    const newTask = {
      id: taskId || new Date().getTime(),
      name: taskName,
      durationMinutes: hoursNum * 60 + minutesNum,
    };
    const existingTasks = await fetchExistingTasks();
    const updatedTasks = taskId
      ? existingTasks.map((task) => (task.id === taskId ? newTask : task))
      : [...existingTasks, newTask];

    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    navigation.navigate("TaskList", { updated: true });
    Toast.show({
      type: "success",
      text1: "Task Added!",
      position: "bottom",
    });
  };

  const handleDeleteTask = async () => {
    if (taskId) {
      const existingTasks = await fetchExistingTasks();
      const filteredTasks = existingTasks.filter((task) => task.id !== taskId);
      await AsyncStorage.setItem("tasks", JSON.stringify(filteredTasks));
      navigation.goBack();
      Toast.show({
        type: "success",
        text1: "Task Deleted",
        position: "bottom",
      });
    }
  };

  const handleTimeIncrement = (addedMinutes) => {
    let currentMinutes = parseInt(minutes, 10) || 0;
    let currentHours = parseInt(hours, 10) || 0;
    let totalMinutes = currentMinutes + addedMinutes;
    let additionalHours = Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;
    setHours((currentHours + additionalHours).toString());
    setMinutes(totalMinutes.toString());
  };

  return (
    <View style={styles.container}>
      <AppText>Enter task block</AppText>
      <TextInput
        style={styles.textInput}
        placeholder="Task Name"
        value={taskName}
        onChangeText={setTaskName}
      />
      <AppText>Estimated Duration</AppText>
      <View style={styles.timeInputs}>
        <TextInput
          style={styles.numberLayout}
          keyboardType="numeric"
          placeholder="HH"
          value={hours}
          onChangeText={(text) => setHours(text)}
        />
        <Text style={styles.semicolon}>:</Text>
        <TextInput
          style={styles.numberLayout}
          keyboardType="numeric"
          placeholder="MM"
          value={minutes}
          onChangeText={(text) => setMinutes(text)}
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
          onPress={() => navigation.goBack()}
        />
        <IconButton iconName="check" onPress={handleSubmit} />
        {taskId && (
          <IconButton
            iconName="trash-alt"
            style={styles.deleteButton}
            onPress={handleDeleteTask}
          />
        )}
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
