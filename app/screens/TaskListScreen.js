import BottomSheet from "@gorhom/bottom-sheet";
import Constants from "expo-constants";
import { useEffect, useMemo, useRef } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import AppButton from "../components/AppButton";
import IconButton from "../components/IconButton";
import IncompleteTaskList from "../components/IncompleteTaskList";
import colors from "../config/colors";
import useTaskStore from "../store/TaskStore";
import AddTaskScreen from "./AddTaskScreen";
import Toast from "react-native-toast-message";
import CompletedTasks from "../components/CompletedTasks";
import { useState } from "react";

export default function TaskListScreen() {
  const [isPaused, setIsPaused] = useState(true);
  const {
    loadTasks,
    isBottomSheetVisible,
    openBottomSheet,
    closeBottomSheet,
    clearTaskInputs,
    startTimer,
    tasks,
    resumeTimer,
    pauseTimer,
    activeTaskId,
    getIncompleteTasks,
  } = useTaskStore((state) => ({
    loadTasks: state.loadTasks,
    tasks: state.tasks.filter((task) => task.taskStatus === "incomplete"),
    isBottomSheetVisible: state.isBottomSheetVisible,
    openBottomSheet: state.openBottomSheet,
    closeBottomSheet: state.closeBottomSheet,
    clearTaskInputs: state.clearTaskInputs,
    startTimer: state.startTimer,
    pauseTimer: state.pauseTimer,
    resumeTimer: state.resumeTimer,
    activeTaskId: state.activeTaskId,
    timerRunning: false,
    currentTaskId: null,
    getIncompleteTasks: state.getIncompleteTasks,
  }));

  const snapPoints = useMemo(() => ["25%", "50%", "70%"]);
  const bottomSheetRef = useRef(null);

  const snapToIndex = (index) => bottomSheetRef.current?.snapToIndex(index);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (isBottomSheetVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isBottomSheetVisible]);

  // useEffect(() => {
  //   if (tasks.length === 0) {
  //     setIsPaused(true);
  //   }
  // }, [tasks]);

  const handleStartFirstTimer = () => {
    if (tasks.length > 0) {
      startTimer(tasks[0].id);
    } else {
      Toast.show({
        type: "error",
        text1: "There are no tasks set!",
        position: "bottom",
      });
    }
  };

  const handleToggleTimer = () => {
    if (tasks.length > 0) {
      if (isPaused) {
        startTimer(tasks[0].id);
        setIsPaused(false);
      } else {
        pauseTimer();
        setIsPaused(true);
      }
    } else {
      Toast.show({
        type: "error",
        text1: "There are no tasks set!",
        position: "bottom",
      });
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <AppButton title="Add Task" onPress={openBottomSheet} />
        <IconButton
          iconName={isPaused ? "play" : "pause"}
          onPress={handleToggleTimer}
        />
      </View>
      <View style={styles.incompleteList}>
        <IncompleteTaskList />
      </View>
      <View style={styles.incompleteList}>
        <CompletedTasks />
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        keyboardBehavior="extend"
        snapPoints={snapPoints}
        enablePanDownToClose={true}
      >
        <View style={styles.contentContainer}>
          <IconButton
            iconName="arrow-down"
            style={styles.closeBottomSheet}
            onPress={closeBottomSheet}
            color={colors.black}
          />
          <AddTaskScreen />
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    padding: 20,
  },
  closeBottomSheet: {
    backgroundColor: colors.medium,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#121212",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  containerHeadline: {
    fontSize: 24,
    fontWeight: "600",
    padding: 20,
    color: "#fff",
  },
  incompleteList: {
    flex: 1,
    justifyContent: "center",

    alignItems: "center",
    width: "90%",
  },
});
