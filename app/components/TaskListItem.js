import { useFocusEffect } from "@react-navigation/native";
import AddTaskScreen from "./AddTaskScreen";
import React, { useEffect, useState } from "react";
import { Keyboard } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  FlatList,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "../components/AppText/AppText";
import TaskItem from "../components/TaskItem";
import colors from "../config/colors";

import IconButton from "../components/IconButton";

import { useNavigation } from "@react-navigation/native";
import AppButton from "../components/AppButton";
import BottomSheet from "../components/BottomSheet";
import Header from "../components/Header";
import { TouchableHighlight } from "react-native-gesture-handler";
import TaskItemSwipeDelete from "../components/TaskItemSwipeDelete";
import { handleTaskDelete } from "../components/TaskHelper";
import CompletedTasks from "../components/CompletedTasks";

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
    SetEditTask(null);
    setIsBottomSheetVisible(true);
  };

  const handleOpenBottomSheetEditTask = (
    task,
    remainingTime = null,
    isCurrentTask = false
  ) => {
    SetEditTask({ ...task, remainingTime, isCurrentTask });
    setIsBottomSheetVisible(true);
  };

  const toggleBottomSheet = () => {
    setIsBottomSheetVisible(!isBottomSheetVisible);
  };

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
      if (!timerStarted || remainingTime === 0) {
        setCurrentTaskIndex(0);
        setRemainingTime(tasks.length > 0 ? tasks[0].durationMinutes * 60 : 0);
        setTimerStarted(true);
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

  useEffect(() => {
    if (remainingTime > 0 || !countdownActive) return;
    const markCurrentTaskAsComplete = () => {
      const updatedTasks = tasks.map((task, index) => {
        if (index === currentTaskIndex) {
          return { ...task, taskStatus: "completed" };
        }
        return task;
      });
      setTasks(updatedTasks);
      AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    };
    markCurrentTaskAsComplete();
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex((currentIndex) => currentIndex + 1);
      setRemainingTime(tasks[currentTaskIndex + 1].durationMinutes * 60);
    } else {
      setCoundownActive(false);
    }
  }, [remainingTime, countdownActive, currentTaskIndex, tasks]);

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

  const handleTaskSubmit = async (newOrUpdatedTask) => {
    let isCurrentTaskBeingEdited =
      editTask &&
      currentTaskIndex === tasks.findIndex((task) => task.id === editTask.id);
    const updatedTasks = editTask
      ? tasks.map((task) =>
          task.id === editTask.id
            ? { ...newOrUpdatedTask, id: editTask.id }
            : task
        )
      : [
          ...tasks,
          { ...newOrUpdatedTask, id: new Date().getTime().toString() },
        ];

    setTasks(updatedTasks);
    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    if (isCurrentTaskBeingEdited) {
      setRemainingTime(newOrUpdatedTask.durationMinutes * 60);
    }
    updateEndTime();
    SetEditTask(null);
    toggleBottomSheet();
  };

  const handleTaskCancel = () => {
    SetEditTask(null);
    toggleBottomSheet();
  };

  const renderItem = ({ item, index }) => (
    <TouchableHighlight
      underlayColor={colors.taskItemSecondary}
      onPress={() => {
        const editingCurrentTask =
          index === currentTaskIndex && countdownActive;
        if (editingCurrentTask) {
          setCoundownActive(false);
        }
        const remainingMinutes = editingCurrentTask
          ? Math.floor(remainingTime / 60)
          : item.durationMinutes;

        setIsBottomSheetVisible(true);
        handleOpenBottomSheetEditTask(item, remainingTime, editingCurrentTask);
      }}
      style={{ opacity: index < currentTaskIndex ? 0.5 : 1 }}
    >
      <TaskItem
        title={item.name}
        renderRightActions={() => (
          <TaskItemSwipeDelete
            onPress={() =>
              handleTaskDelete(
                item.id,
                tasks,
                setTasks,
                SetEditTask,
                toggleBottomSheet
              )
            }
          />
        )}
        time={
          index === currentTaskIndex
            ? formatRemainingTime(remainingTime)
            : `${Math.floor(item.durationMinutes / 60)}h:${
                item.durationMinutes % 60
              }m`
        }
      />
    </TouchableHighlight>
  );
  return (
    <>
      <BottomSheet isVisible={isBottomSheetVisible} onClose={toggleBottomSheet}>
        <AddTaskScreen
          task={editTask}
          onTaskSubmit={handleTaskSubmit}
          onTaskCancel={handleTaskCancel}
          tasks={tasks}
          setTasks={setTasks}
          toggleBottomSheet={toggleBottomSheet}
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
              renderItem={renderItem}
            />
          </View>
          <View style={styles.time}>
            <View>
              <IconButton iconName="fast-backward" onPress={handleRestart} />
            </View>
            <Header>Total Time</Header>
            <AppText>{`${totalHours}h:${totalMinutes}m`}</AppText>
          </View>
          <CompletedTasks />
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
    justifyContent: "space-between",
  },
  name: {
    justifyContent: "flex-start",
  },
  taskList: {
    width: "100%",
    marginVertical: 20,
    padding: 5,
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
