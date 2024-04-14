import { View, Text } from "react-native";
import IncompleteTaskList from "../components/IncompleteTaskList";
import useTaskStore from "../store/TaskStore";
import React, { useEffect } from "react";

export default function TaskListScreen() {
  const { loadTasks } = useTaskStore();

  useEffect(() => {
    loadTasks();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <Text>Incomplete Tasks</Text>
      <IncompleteTaskList />
    </View>
  );
}
