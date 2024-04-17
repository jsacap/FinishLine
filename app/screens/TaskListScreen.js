import BottomSheet from "@gorhom/bottom-sheet";
import Constants from "expo-constants";
import { useEffect, useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppButton from "../components/AppButton";
import IconButton from "../components/IconButton";
import IncompleteTaskList from "../components/IncompleteTaskList";
import colors from "../config/colors";
import useTaskStore from "../store/TaskStore";
import AddTaskScreen from "./AddTaskScreen";
import Toast from "react-native-toast-message";
import CompletedTasks from "../components/CompletedTasks";
import TimeCompletion from "../components/TimeCompletion";
import TimeButton from "../components/AppText/TimeButton";

export default function TaskListScreen() {
  const {
    loadTasks,
    isBottomSheetVisible,
    openBottomSheet,
    closeBottomSheet,
    clearTaskInputs,
    startTimer,
    toggleTimer,
    pauseTimer,
    resumeTimer,
    activeTaskId,
    getIncompleteTasks,
  } = useTaskStore((state) => ({
    loadTasks: state.loadTasks,
    isBottomSheetVisible: state.isBottomSheetVisible,
    openBottomSheet: state.openBottomSheet,
    closeBottomSheet: state.closeBottomSheet,
    clearTaskInputs: state.clearTaskInputs,
    startTimer: state.startTimer,
    timerRunning: false,
    currentTaskId: null,
    getIncompleteTasks: state.getIncompleteTasks,
    toggleTimer: state.toggleTimer,
    pauseTimer: state.pauseTimer,
    resumeTimer: state.resumeTimer,
    activeTaskId: state.activeTaskId,
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

  const getButtonTitle = () => {
    if (!activeTaskId) return "Start";
    const task = getIncompleteTasks().find((task) => task.id === activeTaskId);
    return task && task.timerActive ? "Pause" : "Resume";
  };
  const handleTimerControl = () => {
    const tasks = getIncompleteTasks();
    if (!activeTaskId && tasks.length > 0) {
      toggleTimer(tasks[0].id);
    } else {
      // Check if the currently active task is running and either pause or resume it
      const activeTask = tasks.find((task) => task.id === activeTaskId);
      if (activeTask && activeTask.timerActive) {
        pauseTimer(activeTaskId);
      } else {
        resumeTimer(activeTaskId);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <AppButton title="Add Task" onPress={openBottomSheet} />
        <AppButton title={getButtonTitle()} onPress={handleTimerControl} />
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
