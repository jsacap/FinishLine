import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableHighlight, StyleSheet } from "react-native";
import TaskItem from "./TaskItem";
import colors from "../config/colors";
import Header from "./Header";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CompletedTasks() {
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const fetchCompletedTasks = async () => {
    const taskString = await AsyncStorage.getItem("tasks");
    const tasks = taskString ? JSON.parse(taskString) : [];
    const completedTasks = tasks.filter(
      (task) => task.taskStatus === "completed"
    );
    setCompletedTasks(completedTasks);
  };

  const renderItem = ({ item }) => (
    <TouchableHighlight
      underlayColor={colors.taskItemSecondary}
      onPress={() => console.log("Task pressed")}
      style={{ opacity: 0.5 }}
    >
      <TaskItem title={item.name} time={item.time} />
    </TouchableHighlight>
  );

  return (
    <View>
      <Header>Completed Tasks</Header>
      <FlatList
        data={completedTasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}
