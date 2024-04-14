import React from "react";
import { FlatList, TouchableHighlight, View } from "react-native";
import colors from "../config/colors";
import useTaskStore from "../store/TaskStore";
import Header from "./Header";
import TaskItem from "./TaskItem";

export default function CompletedTasks() {
  const completedTasks = useTaskStore((state) => state.getCompletedTasks());

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
      {completedTasks.map((task) => (
        <Text key={task.id}>{task.name}</Text>
      ))}
    </View>
  );
}
