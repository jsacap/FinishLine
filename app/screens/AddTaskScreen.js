import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, Dimensions, Text } from "react-native";
import AppText from "../components/AppText/AppText";

import colors from "../config/colors";
import IconButton from "../components/IconButton";
import { Header } from "react-native/Libraries/NewAppScreen";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function AddTaskScreen({ route }) {
  const navigation = useNavigation();
  const [taskName, setTaskName] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [taskId, setTaskId] = useState(null);
  useEffect(() => {
    if (route.params?.task) {
      const task = route.params.task;
      setTaskName(task.name);
      const duration = task.durationMinutes;
      setHours(Math.floor(duration / 60).toString());
      setMinutes((duration % 60).toString());
      setTaskId(task.id);
    }
  }, [route.params?.task]);

  const fetchExistingTasks = async () => {
    const tasksString = await AsyncStorage.getItem("tasks");
    return tasksString ? JSON.parse(tasksString) : [];
  };

  const handleSubmit = async () => {
    console.log("Hours:", hours, "Minutes:", minutes);
    const hoursNum = parseInt(hours, 10) || 0;
    const minutesNum = parseInt(minutes, 10) || 0;

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
    navigation.navigate("TaskList");
  };

  const handleDeleteTask = async () => {
    if (taskId) {
      // Logic to delete here
    }
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
          onChangeText={setHours}
        />
        <Text style={styles.semicolon}>:</Text>
        <TextInput
          style={styles.numberLayout}
          keyboardType="numeric"
          placeholder="MM"
          value={minutes}
          onChangeText={setMinutes}
        />
      </View>

      <View style={styles.buttons}>
        <IconButton
          style={styles.cancelButton}
          iconName="arrow-left"
          onPress={() => navigation.goBack()}
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
    backgroundColor: colors.secondary,
    marginRight: 20,
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
});

export default AddTaskScreen;
