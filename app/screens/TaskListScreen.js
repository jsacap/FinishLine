import { AntDesign } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  AppState,
  Dimensions,
  StyleSheet,
  View,
  Text,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText/AppText";
import CompletedTasks from "../components/CompletedTasks";
import IncompleteTaskList from "../components/IncompleteTaskList";
import colors from "../config/colors";
import useTaskStore from "../store/TaskStore";
import AddTaskScreen from "./AddTaskScreen";
import { Notifications } from "expo";

const { width } = Dimensions.get("window");

export default function TaskListScreen() {
  const navigation = useNavigation();
  const [displayedFinishTime, setDisplayedFinishTime] = useState("");

  const {
    loadTasks,
    isBottomSheetVisible,
    openBottomSheet,
    initializeSound,
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
    updateTimersOnForeground: state.updateTimersOnForeground,
    initializeSound: state.initializeSound,
    startTime: state.startTime,
    startTimer: state.startTimer,
    pauseTimer: state.pauseTimer,
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
    loadTasks(), initializeSound();
    setDisplayedFinishTime(calculateFutureCompletionTime());
    const interval = setInterval(() => {
      setDisplayedFinishTime(calculateFutureCompletionTime());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "active") {
        // App has come to the foreground
        // Check if any timer should be adjusted
        const { startTime, tasks, updateTimersOnForeground } =
          useTaskStore.getState();
        if (startTime && tasks.some((task) => task.timerActive)) {
          updateTimersOnForeground(new Date() - startTime);
        }
      }
    };

    AppState.addEventListener("change", handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
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
        {!isPaused && (
          <Text
            style={styles.activeTask}
            onPress={() => navigation.navigate("ActiveTask")}
          >
            Go to active task...
          </Text>
        )}
      </View>
      {/* <Button title="SandbOx" onPress={() => navigation.navigate("SandBox")} /> */}

      <View style={styles.incompleteList}>
        <View style={styles.addTaskButton}>
          <AppButton title="Add Task" onPress={openBottomSheet} />
        </View>
        {tasks.length > 0 && (
          <View style={styles.times}>
            <AppText style={styles.totalTime}>Total: {totalTime}</AppText>
            <AppText style={styles.totalTime}>
              Finish Time: {futureCompletionTime}
            </AppText>
          </View>
        )}

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
  activeTask: {
    color: colors.white,
  },
  addTaskButton: {
    width: "100%",
  },
  buttons: {
    alignItems: "center",
    justiofycContent: "center",

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
