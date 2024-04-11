import { View, Text, FlatList } from "react-native";
import colors from "../config/colors";
import React from "react";
import { TouchableHighlight } from "react-native-gesture-handler";
import TaskItem from "./TaskItem";
import TaskItemSwipeDelete from "./TaskItemSwipeDelete";
import { handleTaskDelete } from "./TaskHelper";

const IncompleteTasks = ({
  incompleteTasks,
  handleOpenBottomSheetEditTask,
  currentTaskIndex,
  remainingTime,
  formatRemainingTime,
}) => {
  const renderItem = ({ item, index }) => (
    <TouchableHighlight
      underlayColor={colors.taskItemSecondary}
      onPress={() => handleOpenBottomSheetEditTask(item)}
    >
      <TaskItem
        title={item.name}
        time={`${Math.floor(item.durationMinutes / 60)}h:${
          item.durationMinutes % 60
        }m`}
      />
    </TouchableHighlight>
  );

  return (
    <FlatList
      data={incompleteTasks}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
    />
  );
};

export default IncompleteTasks;
