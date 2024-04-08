import { useFocusEffect } from "@react-navigation/native";
import AddTaskScreen from "./AddTaskScreen";
import React, { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  FlatList,
  ImageBackground,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "../components/AppText/AppText";
import TaskItem from "../components/TaskItem";

import IconButton from "../components/IconButton";

import { useNavigation } from "@react-navigation/native";
import AppButton from "../components/AppButton";
import BottomSheet from "../components/BottomSheet";
import Header from "../components/Header";

function TaskListScreen() {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [endTime, setEndTime] = useState("");
  const navigation = useNavigation();
  const [editTask, SetEditTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [countdownActive, setCoundownActive] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const handleOpenBottomSheetNewTask = () => {
    SetEditTask(null); // Prepare for adding a new task
    setIsBottomSheetVisible(true);
  };

  const handleOpenBottomSheetEditTask = (task) => {
    SetEditTask(task); // Prepare for editing an existing task
    setIsBottomSheetVisible(true);
  };

  const toggleBottomSheet = () => {
    setIsBottomSheetVisible(!isBottomSheetVisible);
  };

  useFocusEffect(
    React.useCallback(() => {
      const refreshTasks = async () => {
        const storedTasks = await AsyncStorage.getItem("tasks");
        const parsedTasks = storedTasks ? JSON.parse(storedTasks) : [];
        setTasks(parsedTasks);

        if (!countdownActive) {
          setCurrentTaskIndex(0);
          const totalSeconds = getTotalDurationMinutes(parsedTasks) * 60;
          setRemainingTime(
            parsedTasks.length > 0 ? parsedTasks[0].durationMinutes * 60 : 0
          );
          updateEndTime(totalSeconds);
        }
      };
      refreshTasks();
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
      if (!timerStarted || remainingTime === 0) {
        setCurrentTaskIndex(0);
        setRemainingTime(tasks.length > 0 ? tasks[0].durationMinutes * 60 : 0);
        setTimerStarted(true); // Indicating that the timer has been started at least once.
      }
      setCoundownActive(true);
    }
    updateEndTime();
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

  const handleRestart = () => {
    setCurrentTaskIndex(0);

    setRemainingTime(tasks.length > 0 ? tasks[0].durationMinutes * 60 : 0);

    const totalSeconds = getTotalDurationMinutes(tasks) * 60;
    const endTimeDate = new Date(new Date().getTime() + totalSeconds * 1000);
    const formattedEndTime = `${endTimeDate.getHours()}:${
      endTimeDate.getMinutes() < 10 ? "0" : ""
    }${endTimeDate.getMinutes()}`;
    setEndTime(formattedEndTime);

    setCoundownActive(false);
  };
  function renderBottomSheetContent() {
    if (!isBottomSheetVisible) return null;

    return (
      <AddTaskScreen
        task={editTask}
        onTaskSubmit={(newOrUpdatedTask) => {
          const updatedTasks = editTask
            ? tasks.map((task) =>
                task.id === editTask.id ? newOrUpdatedTask : task
              )
            : [
                ...tasks,
                { ...newOrUpdatedTask, id: new Date().getTime().toString() },
              ];

          setTasks(updatedTasks);
          AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));

          SetEditTask(null);
          toggleBottomSheet();
        }}
        onTaskCancel={() => {
          SetEditTask(null);
          toggleBottomSheet();
        }}
        onTaskDelete={(taskId) => {
          const updatedTasks = tasks.filter((task) => task.id !== taskId);
          setTasks(updatedTasks);
          AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
          toggleBottomSheet();
          SetEditTask(null); // Ensure this state update logic matches your application's structure
        }}
      />
    );
  }

  return (
    <>
      <BottomSheet isVisible={isBottomSheetVisible} onClose={toggleBottomSheet}>
        <AddTaskScreen
          task={editTask}
          onTaskSubmit={(newOrUpdatedTask) => {
            const updatedTasks = editTask
              ? tasks.map((task) =>
                  task.id === editTask.id
                    ? { ...newOrUpdatedTask, id: editTask.id }
                    : task
                )
              : [
                  ...tasks,
                  {
                    ...newOrUpdatedTask,
                    id: new Date().getTime().toString(),
                  },
                ];

            setTasks(updatedTasks);
            AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
            toggleBottomSheet();
            SetEditTask(null);
          }}
          onTaskCancel={() => {
            toggleBottomSheet();
            SetEditTask(null);
          }}
          onTaskDelete={(taskId) => {
            const updatedTasks = tasks.filter((task) => task.id !== taskId);
            setTasks(updatedTasks);
            AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
            toggleBottomSheet();
            SetEditTask(null);
          }}
        />
      </BottomSheet>
      <ImageBackground
        style={styles.background}
        source={require("../assets/Background2.jpg")}
      >
        <View style={styles.buttons}>
          <AppButton
            style={styles.addButton}
            title="Add Task"
            onPress={toggleBottomSheet}
          />

          {/* <AppButton
            style={styles.addButton}
            title="Add Task"
            onPress={() => navigation.navigate("AddTask")}
          /> */}
          {tasks.length > 0 && (
            <AppButton
              title={
                !timerStarted ? "START" : countdownActive ? "PAUSE" : "RESUME"
              }
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
                  onPress={() => {
                    const editingCurrentTask =
                      index === currentTaskIndex && countdownActive;
                    if (editingCurrentTask) {
                      setCoundownActive(false);
                    }
                    const remainingMinutes = editingCurrentTask
                      ? Math.floor(remainingTime / 60)
                      : item.durationMinutes;

                    const taskDataForEditing = {
                      ...item,
                      editingCurrentTask,
                      remainingMinutes: remainingMinutes,
                    };

                    setIsBottomSheetVisible(true);
                    handleOpenBottomSheetEditTask(item);
                  }}
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
            <View>
              <IconButton iconName="fast-backward" onPress={handleRestart} />
            </View>
            <Header>Total Time</Header>
            <AppText>{`${totalHours}h:${totalMinutes}m`}</AppText>
          </View>
          <View style={styles.time}>
            <AppText>Completion Time</AppText>
            <Header>{endTime}</Header>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </>
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
    top: 30,
    justifyContent: "space-between",
    width: 300,
    height: "15%",
  },
  playButton: {
    backgroundColor: "green",
  },
});

export default TaskListScreen;
