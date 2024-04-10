import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Header from "./Header";
import TaskItem from "./TaskItem";

export default function CompletedTasks() {
  fetchCompletedTasks = async () => {
    const taskString = await AsyncStorage.getItem("tasks");
    const tasks = taskString ? JSON.parse(tasksString) : [];
    const completedTasks = tasks.filter(
      (task) => task.taskStatus === "complete"
    );
    return completedTasks;
    console.log(completedTasks);
  };
  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  return (
    <View>
      <Header>Completed Tasks</Header>
      <TaskItem></TaskItem>
    </View>
  );
}
