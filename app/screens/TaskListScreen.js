import { useFocusEffect } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import AppText from "../components/AppText/AppText";
import TaskItem from "../components/TaskItem";
import colors from "../config/colors";
import AddTaskScreen from "./AddTaskScreen";

import IconButton from "../components/IconButton";

import { useNavigation } from "@react-navigation/native";
import { TouchableHighlight } from "react-native-gesture-handler";
import AppButton from "../components/AppButton";
import BottomSheet from "../components/BottomSheet";
import CompletedTasks from "../components/CompletedTasks";
import Header from "../components/Header";
import { handleTaskDelete } from "../components/TaskHelper";
import TaskItemSwipeDelete from "../components/TaskItemSwipeDelete";
import useTasksStore from "../store/TaskStore";
import TaskListItem from "../components/TaskListItem";

function TaskListScreen() {
  const {
    tasks,
    setEditTask,
    countdownActive,
    tick,
    initializeTimer,
    toggleBottomSheetVisibility,
    totalDuration,
    endTime,
    handleStart,
    handleRestart,
    isBottomSheetVisible,
  } = useTasksStore((state) => ({
    tasks: state.tasks.filter((task) => task.taskStatus === "incomplete"),
    totalDuration: state.totalDuration,
    endTime: state.endTime,
    initializeTimer: state.initializeTimer,
    isBottomSheetVisible: state.isBottomSheetVisible,
  }));
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const navigation = useNavigation();
  const [timerStarted, setTimerStarted] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(Date.now());

  const fetchTasks = useTasksStore((state) => state.fetchTasks);
  const completeTask = useTasksStore((state) => state.completeTask);

  const handleOpenBottomSheetNewTask = () => {
    setEditTask(null);
    setIsBottomSheetVisible(true);
  };

  const handleOpenBottomSheetEditTask = (
    task,
    remainingTime = null,
    isCurrentTask = false
  ) => {
    setEditTask({ ...task, remainingTime, isCurrentTask });
    setIsBottomSheetVisible(true);
  };

  const toggleBottomSheet = () => {
    setIsBottomSheetVisible(!isBottomSheetVisible);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTasks();

      return () => {
        // Optional: Any cleanup actions
      };
    }, [fetchTasks])
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

  // const handleStart = () => {
  //   if (countdownActive) {
  //     setCoundownActive(false);
  //   } else {
  //     if (!timerStarted || remainingTime === 0) {
  //       setCurrentTaskIndex(0);
  //       setRemainingTime(tasks.length > 0 ? tasks[0].durationMinutes * 60 : 0);
  //       setTimerStarted(true);
  //     }
  //     setCoundownActive(true);
  //   }
  //   updateEndTime();
  // };

  const formatRemainingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m:${secs < 10 ? "0" : ""}${secs}s`;
  };

  useEffect(() => {
    const interval = countdownActive
      ? setInterval(() => {
          tick();
        }, 1000)
      : null;

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [countdownActive, tick]);

  useEffect(() => {
    fetchTasks().then(() => {
      initializeTimer();
    });
  }, []);

  // const handleRestart = () => {
  //   setCurrentTaskIndex(0);

  //   setRemainingTime(tasks.length > 0 ? tasks[0].durationMinutes * 60 : 0);

  //   const totalSeconds = getTotalDurationMinutes(tasks) * 60;
  //   const endTimeDate = new Date(new Date().getTime() + totalSeconds * 1000);
  //   const formattedEndTime = `${endTimeDate.getHours()}:${
  //     endTimeDate.getMinutes() < 10 ? "0" : ""
  //   }${endTimeDate.getMinutes()}`;
  //   setEndTime(formattedEndTime);

  //   setCoundownActive(false);
  // };

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

  return (
    <>
      <BottomSheet isVisible={isBottomSheetVisible} onClose={toggleBottomSheet}>
        <AddTaskScreen />
        {/* <AddTaskScreen
          task={editTask} // Pass the task to edit, if any
          onTaskCancel={() => {
            setIsBottomSheetVisible(false);
          }}
          setBottomSheetVisibility={setIsBottomSheetVisible} // Function to control visibility
        /> */}
      </BottomSheet>

      <ImageBackground
        style={styles.background}
        source={require("../assets/Background2.jpg")}
      >
        <View style={styles.buttons}>
          <AppButton
            title="Add Task"
            onPress={() => setEditTask(null)}
            style={styles.addButton}
          />

          {tasks.length > 0 && (
            <AppButton
              title={countdownActive ? "Pause" : "Start"}
              onPress={handleStart}
              style={styles.playButton}
            />
          )}
        </View>

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.taskList}>
            <FlatList
              data={tasks}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TaskListItem item={item} index={index} />
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
          <CompletedTasks refreshTrigger={refreshTrigger} />
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
