import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import useTaskStore from "../store/TaskStore";
import Header from "./Header";
import TaskItem from "./TaskItem";
import TaskItemSwipeDelete from "./TaskItemSwipeDelete";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useState } from "react/cjs/react.production.min";
import TotalTaskTime from "./TotalTaskTime";

export default function IncompleteTaskList() {
  const { incompleteTasks, loadTaskForEditing, openBottomSheet, deleteTask } =
    useTaskStore((state) => ({
      incompleteTasks: state.getIncompleteTasks(),
      deleteTask: state.deleteTask,
      loadTaskForEditing: state.loadTaskForEditing,
      openBottomSheet: state.openBottomSheet,
    }));

  const handleTaskPress = (taskId) => {
    loadTaskForEditing(taskId);
    openBottomSheet();
  };

  const renderItem = ({ item }) => {
    const renderRightActions = () => (
      <TaskItemSwipeDelete onPress={() => deleteTask(item.id)} />
    );

    return (
      <Swipeable renderRightActions={renderRightActions}>
        <TouchableOpacity onPress={() => handleTaskPress(item.id)}>
          <TaskItem taskId={item.id} renderRightActions={renderRightActions} />
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <TotalTaskTime tasks={incompleteTasks} />
      <FlatList
        data={incompleteTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
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
  status: {
    fontSize: 14,
    color: "#2f2f2f",
  },
});
