import { View, Text, StyleSheet } from "react-native";
import colors from "../config/colors";
import React from "react";
import useTaskStore from "../store/TaskStore";
import TaskItem from "./TaskItem";
import TaskItemSwipeDelete from "./TaskItemSwipeDelete";
import Header from "./Header";
import { FlatList } from "react-native-gesture-handler";

export default function CompletedTasks() {
  const { completedTasks, deleteTask } = useTaskStore((state) => ({
    completedTasks: state.getCompletedTasks(),
    deleteTask: state.deleteTask,
  }));

  const renderItem = ({ item }) => {
    const renderRightActions = () => (
      <TaskItemSwipeDelete onPress={() => deleteTask(item.id)} />
    );

    return (
      <TaskItem
        taskId={item.id}
        renderRightActions={renderRightActions}
        stlye={styles.taskContainer}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header>Completed</Header>
      <FlatList
        data={completedTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    width: "100%",
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  taskContainer: {
    backgroundColor: colors.taskItemSecondary,
  },
});
