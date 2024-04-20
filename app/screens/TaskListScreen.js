import { AntDesign } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import Constants from "expo-constants";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Dimensions, StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import AppButton from "../components/AppButton";
import CompletedTasks from "../components/CompletedTasks";
import IconButton from "../components/IconButton";
import IncompleteTaskList from "../components/IncompleteTaskList";
import TotalTaskTime from "../components/TotalTaskTime";
import colors from "../config/colors";
import useTaskStore from "../store/TaskStore";
import AddTaskScreen from "./AddTaskScreen";
import AppText from "../components/AppText/AppText";
// import calculateTotalTime from "../components/calculateTotalTime";

const { width } = Dimensions.get("window");

export default function TaskListScreen() {
  const navigation = useNavigation();
  const {
    loadTasks,
    isBottomSheetVisible,
    openBottomSheet,
    closeBottomSheet,
    startTimer,
    tasks,
    pauseTimer,
    isPaused,
    togglePause,
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
    isPaused: state.isPaused,
    togglePause: state.togglePause,
  }));

  const snapPoints = useMemo(() => ["25%", "50%", "70%"]);
  const bottomSheetRef = useRef(null);

  useEffect(() => {
    loadTasks();
    console.log(tasks);
  }, []);

  useEffect(() => {
    if (isBottomSheetVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isBottomSheetVisible]);
  const calculateFutureCompletionTime = () => {
    const totalSeconds = tasks.reduce(
      (total, task) => total + task.remainingSeconds,
      0
    );
    // time totals
    const futureTime = new Date(new Date().getTime() + totalSeconds * 1000);
    return futureTime.toLocaleTimeString();
  };

  const calculateTotalTime = () => {
    const totalSeconds = tasks.reduce(
      (acc, task) => acc + task.remainingSeconds,
      0
    );
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const futureCompletionTime = calculateFutureCompletionTime();
  const totalTime = useMemo(calculateTotalTime, [tasks]);

  const handleToggleTimer = () => {
    if (tasks.length > 0) {
      if (isPaused) {
        startTimer(tasks[0].id);
        togglePause();
        navigation.navigate("ActiveTask");
      } else {
        pauseTimer();
        togglePause();
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
    <SafeAreaView style={styles.container}>
      <View style={styles.buttons}>
        <AntDesign
          name={isPaused ? "play" : "pause"}
          size={50}
          color={colors.taskItemSecondary}
          onPress={handleToggleTimer}
        />
      </View>

      <View style={styles.incompleteList}>
        <View>
          <AppButton title="Add Task" onPress={openBottomSheet} />
        </View>
        <View style={styles.times}>
          <AppText style={styles.totalTime}>Total: {totalTime}</AppText>
          <AppText style={styles.totalTime}>
            Finish Time: {futureCompletionTime}
          </AppText>
        </View>

        <IncompleteTaskList />
      </View>

      <View style={styles.incompleteList}>
        <CompletedTasks />
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        keyboardBehavior="interactive"
        snapPoints={snapPoints}
        enablePanDownToClose={true}
      >
        <View style={styles.contentContainer}>
          <AddTaskScreen />
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttons: {
    padding: 20,
  },
  closeBottomSheet: {
    backgroundColor: colors.black,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: colors.darkCharcoal,
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.black,
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
  play: {
    width: width * 0.25,
    height: width * 0.25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.darkCharcoal,
  },
  times: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalTime: {
    color: colors.gold,
    fontSize: 12,
  },
});
