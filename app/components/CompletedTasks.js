import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableHighlight, StyleSheet } from "react-native";
import TaskItem from "./TaskItem";
import colors from "../config/colors";
import Header from "./Header";
import useTasksStore from "../store/TaskStore";
export default function CompletedTasks() {
  const { tasks } = useTasksStore((state) => ({
    tasks: state.tasks.filter((task) => task.taskStatus === "completed"),
  }));

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
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}
