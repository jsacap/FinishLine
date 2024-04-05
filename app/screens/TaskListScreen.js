import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from "react-native";
import TaskItem from "../components/TaskItem";
import TimeCompletion from "../components/TimeCompletion";
import AppText from "../components/AppText/AppText";
import AsyncStorage from "@react-native-async-storage/async-storage";

import useFindUser from "../hooks/useFindUser";
import IconButton from "../components/IconButton";

import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import AppButton from "../components/AppButton";

function TaskListScreen() {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [totalDuration, setTOtalDuration] = useState(0);
  const [endTime, setEndTime] = useState("");
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchTasks = async () => {
        const storedTasks = await AsyncStorage.getItem("tasks");
        const parsedTasks = storedTasks ? JSON.parse(storedTasks) : [];
        setTasks(parsedTasks);
      };

      fetchTasks();

      return () => {}; // Optional cleanup function
    }, [])
  );

  const getTotalDurationMinutes = (tasks) => {
    return tasks.reduce((total, task) => total + task.durationMinutes, 0);
  };

  const totalDurationMinutes = getTotalDurationMinutes(tasks);
  const totalHours = Math.floor(totalDurationMinutes / 60);
  const totalMinutes = totalDurationMinutes % 60;

  const handleStart = () => {
    setCurrentTaskIndex(0);
    setRemainingTime(tasks[0].durationMinutes);

    // Calculate end time
    const endTimeDate = new Date(
      new Date().getTime() + totalDurationMinutes * 60000
    ); // Convert minutes to milliseconds

    // Format end time as a string (e.g., "2:30 PM")
    const formattedEndTime = `${endTimeDate.getHours()}:${
      endTimeDate.getMinutes() < 10 ? "0" : ""
    }${endTimeDate.getMinutes()}`;

    // Update state
    setEndTime(formattedEndTime);
    console.log(endTime);
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/Background2.jpg")}
    >
      <View style={styles.buttons}>
        <AppButton
          style={styles.addButton}
          title="Add Task"
          onPress={() => navigation.navigate("AddTask")}
        />
        {tasks.length > 0 && (
          <AppButton
            title="START"
            style={styles.playButton}
            onPress={handleStart}
          />
        )}
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.taskList}>
          <FlatList
            data={tasks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate("AddTask", { task: item })}
              >
                <TaskItem
                  title={item.name}
                  time={`${Math.floor(item.durationMinutes / 60)}h:${
                    item.durationMinutes % 60
                  }m`}
                />
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={styles.time}>
          <Header>Total Time</Header>
          <AppText>{`${totalHours}h:${totalMinutes}m`}</AppText>
        </View>
        <View style={styles.time}>
          <Header>Completion Time</Header>
          <AppText>{endTime}</AppText>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    justifyContent: "space-between",
  },
  name: {
    justifyContent: "flex-start",
  },
  taskList: {
    width: "90%",
    marginBottom: 20,
  },
  addButton: {
    width: 60,
  },
  time: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    // flexDirection: "row",
    justifyContent: "space-between",
    width: 300,
    height: "15%",
  },
  playButton: {
    backgroundColor: "green",
  },
});

export default TaskListScreen;
