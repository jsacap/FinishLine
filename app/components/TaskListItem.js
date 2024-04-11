import { View, TouchableHighlight, Text } from "react-native";
import TaskItem from "./TaskItem";
import TaskItemSwipeDelete from "./TaskItemSwipeDelete";
import useTasksStore from "../store/TaskStore";
import colors from "../config/colors";
import React, { useState } from "react";

export default function TaskListItem({ item, index }) {
  const {
    currentTaskIndex,
    countdownActive,
    remainingTime,
    toggleCountdown,
    setEditTask,
  } = useTasksStore();
  const editingCurrentTask = index === currentTaskIndex && countdownActive;

  return (
    <TouchableHighlight
      underlayColor={colors.taskItemSecondary}
      onPress={() => {
        if (editingCurrentTask) {
          toggleCountdown(); // Pause/resume the countdown
        }
        const remainingMinutes = editingCurrentTask
          ? Math.floor(remainingTime / 60)
          : item.durationMinutes;
        setEditTask({
          ...item,
          remainingMinutes,
          isEditingCurrentTask: editingCurrentTask,
        });
      }}
      style={{ opacity: index < currentTaskIndex ? 0.5 : 1 }}
    >
      <TaskItem
        title={item.name}
        renderRightActions={() => (
          <TaskItemSwipeDelete onPress={() => handleTaskDelete(item.id)} />
        )}
        time={
          editingCurrentTask
            ? `${Math.floor(remainingTime / 60)}h:${remainingTime % 60}m`
            : `${Math.floor(item.durationMinutes / 60)}h:${
                item.durationMinutes % 60
              }m`
        }
      />
    </TouchableHighlight>
  );
}
