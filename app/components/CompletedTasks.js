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
        style={styles.completedTaskCOntainer}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header style={styles.header}>Completed</Header>
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
  completedTaskCOntainer: {
    backgroundColor: colors.taskItemSecondary,
  },
  header: {
    color: colors.platinumWhite,
  },
});
