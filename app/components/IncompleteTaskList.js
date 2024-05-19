import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Button,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useTaskStore from "../store/TaskStore";
import Header from "./Header";
import TaskItem from "./TaskItem";
import TaskItemSwipeDelete from "./TaskItemSwipeDelete";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useState } from "react/cjs/react.production.min";
import TotalTaskTime from "./TotalTaskTime";
import TaskItemSwipeStatus from "./TaskItemSwipeStatus";

export default function IncompleteTaskList() {
  const {
    incompleteTasks,
    loadTaskForEditing,
    openBottomSheet,
    deleteTask,
    updateTaskCompletion,
    activeTaskId,
    tasks,
    moveTaskUp,
  } = useTaskStore((state) => ({
    incompleteTasks: state.getIncompleteTasks(),
    deleteTask: state.deleteTask,
    loadTaskForEditing: state.loadTaskForEditing,
    openBottomSheet: state.openBottomSheet,
    updateTaskCompletion: state.updateTaskCompletion,
    activeTaskId: state.activeTaskId,
    tasks: state.tasks,
    moveTaskUp: state.moveTaskUp,
  }));

  const handleTaskPress = (taskId) => {
    loadTaskForEditing(taskId);
    openBottomSheet();
  };

  const renderItem = ({ item, index }) => {
    const renderRightActions = () => (
      <TaskItemSwipeDelete onPress={() => deleteTask(item.id)} />
    );
    const renderLeftActions = () => (
      <TaskItemSwipeStatus
        status={item.taskStatus}
        onPress={() => updateTaskCompletion(item.id)}
      />
    );
    const isTimerActiveOnFirstTask =
      tasks[0]?.timerActive && activeTaskId === tasks[0].id;

    return (
      <Swipeable
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
      >
        <View style={styles.taskItemRow}>
          <TouchableOpacity
            style={styles.taskItemContainer}
            onPress={() => handleTaskPress(item.id)}
          >
            <TaskItem taskId={item.id} />
          </TouchableOpacity>
          {incompleteTasks.length > 1 && (
            <View style={styles.buttonContainer}>
              <MaterialCommunityIcons
                style={styles.upButton}
                name="arrow-up-bold"
                size={30}
                onPress={() => moveTaskUp(item.id)}
                disabled={
                  index === 0 || (isTimerActiveOnFirstTask && index === 1)
                }
              />
            </View>
          )}
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tasks}>
        <FlatList
          data={incompleteTasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 5,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  detail: {
    fontSize: 16,
    color: "#666",
  },
  totalTime: {
    flex: 1,
  },
  status: {
    fontSize: 14,
    color: "#2f2f2f",
  },
  tasks: {
    flex: 1,
    top: 0,
  },
  taskItemRow: {
    flexDirection: "row",
    alignItems: "center", // Vertically centers the items
  },
  taskItemContainer: {
    flex: 1, // Takes up all available space except what the button needs
  },
  upButton: {
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
