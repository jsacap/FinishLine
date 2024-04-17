import BottomSheet from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import AppButton from "../components/AppButton";
import CompletedTasks from "../components/CompletedTasks";
import IconButton from "../components/IconButton";
import IncompleteTaskList from "../components/IncompleteTaskList";
import colors from "../config/colors";
import useTaskStore from "../store/TaskStore";
import AddTaskScreen from "./AddTaskScreen";

export default function TaskListScreen() {
  const [tasks, setTasks] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const {
    isBottomSheetVisible,
    openBottomSheet,
    closeBottomSheet,
    clearTaskInputs,
  } = useTaskStore((state) => ({
    isBottomSheetVisible: state.isBottomSheetVisible,
    openBottomSheet: state.openBottomSheet,
    closeBottomSheet: state.closeBottomSheet,
    clearTaskInputs: state.clearTaskInputs,
  }));
  // bottomsheet logic
  const snapPoints = useMemo(() => ["25%", "50%", "70%"]);
  const bottomSheetRef = useRef(null);

  // const snapToIndex = (index) => bottomSheetRef.current?.snapToIndex(index);
  useEffect(() => {
    if (isBottomSheetVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isBottomSheetVisible]);

  // fetching tasks
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed Loading Tasks",
      });
    }
  };

  const updateTaskCompletion = async (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, status: "complete" };
      }
      return task;
    });

    setTasks(updatedTasks);
    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  // timer logic
  const handleTimer = (taskId) => {
    setActiveTaskId(taskId);
    setTimerRunning(true);
    const timerInterval = setInterval(() => {
      setTasks((currentTasks) => {
        return currentTasks.map((task) => {
          if (task.id === taskId) {
            if (task.remainingSeconds > 0) {
              return {
                ...task,
                remainingSeconds: TaskListScreen.remainingSeconds - 1,
              };
            } else {
              clearInterval(timerInterval);
              updateTaskCompletion(taskId);
              setActiveTaskId(null); // change this to go down the list??
              setTimerRunning(false); // Only false if there are no more tasks in the list?
              return { ...task, status: "complete" };
            }
          }
          return task;
        });
      });
    }, 1000);
  };

  const handlePauseResume = () => {
    setTimerRunning(!timerRunning);
  };

  // Dynamically rendering title for AppButton Start
  const getButtonTitle = () => {
    if (!activeTaskId) return "START";
    return timerRunning ? "Pause" : "Resume";
  };

  // filtering for incomplete tasks
  const incompleteTasks = tasks.filter((task) => task.status !== "complete");
  const completedTasks = tasks.filter((task) => task.status === "complete");

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <AppButton title="Add Task" onPress={openBottomSheet} />
        <AppButton title={getButtonTitle()} onPress={handlePauseResume} />
      </View>
      <View style={styles.incompleteList}>
        <IncompleteTaskList tasks={incompleteTasks} />
      </View>
      <View style={styles.incompleteList}>
        <CompletedTasks tasks={completedTasks} />
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
