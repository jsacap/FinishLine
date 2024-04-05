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
  const [countdownActive, setCoundownActive] = useState(false);

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
  const updateEndTime = () => {
    let totalRemainingSeconds = remainingTime;
    for (let i = currentTaskIndex + 1; i < tasks.length; i++) {
      totalRemainingSeconds += tasks[i].durationMinutes * 60;
    }

    const endTimeDate = new Date(
      new Date().getTime() + totalRemainingSeconds * 1000
    );
    const formattedEndTime = `${endTimeDate.getHours()}:${
      endTimeDate.getMinutes() < 10 ? "0" : ""
    }${endTimeDate.getMinutes()}`;
    setEndTime(formattedEndTime);
  };

  const handleStart = () => {
    if (countdownActive) {
      setCoundownActive(false);
    } else {
      if (remainingTime === 0) {
        setCurrentTaskIndex(0);
        setRemainingTime(tasks.length > 0 ? tasks[0].durationMinutes * 60 : 0);
        const totalSeconds = getTotalDurationMinutes(tasks) * 60;
        const endTimeDate = new Date(
          new Date().getTime() + totalSeconds * 1000
        );
        const formattedEndTime = `${endTimeDate.getHours()}:${
          endTimeDate.getMinutes() < 10 ? "0" : ""
        }${endTimeDate.getMinutes()}`;
        setEndTime(formattedEndTime);
      }
      setCoundownActive(true);
      updateEndTime();
    }
  };

  const formatRemainingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m:${secs < 10 ? "0" : ""}${secs}s`;
  };

  useEffect(() => {
    let interval = null;

    if (countdownActive && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (remainingTime <= 0 && currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex((prevIndex) => prevIndex + 1);
      setRemainingTime(tasks[currentTaskIndex + 1].durationMinutes * 60);
    } else if (currentTaskIndex >= tasks.length - 1) {
      setCoundownActive(false);
    }

    return () => clearInterval(interval);
  }, [countdownActive, remainingTime, currentTaskIndex, tasks]);

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
            title={countdownActive ? "PAUSE" : "START"}
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
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate("AddTask", { task: item })}
                style={{ opacity: index < currentTaskIndex ? 0.5 : 1 }}
              >
                <TaskItem
                  title={item.name}
                  time={
                    index === currentTaskIndex
                      ? formatRemainingTime(remainingTime)
                      : `${Math.floor(item.durationMinutes / 60)}h:${
                          item.durationMinutes % 60
                        }m`
                  }
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
