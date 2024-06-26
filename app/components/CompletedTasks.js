import { View, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../config/colors";
import React from "react";
import useTaskStore from "../store/TaskStore";
import TaskItem from "./TaskItem";
import TaskItemSwipeDelete from "./TaskItemSwipeDelete";
import Header from "./Header";
import { FlatList, Swipeable } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import TaskItemSwipeStatus from "./TaskItemSwipeStatus";

export default function CompletedTasks() {
  const { completedTasks, deleteTask, updateTaskIncomplete } = useTaskStore(
    (state) => ({
      completedTasks: state.getCompletedTasks(),
      deleteTask: state.deleteTask,
      updateTaskIncomplete: state.updateTaskIncomplete,
    })
  );

  const renderItem = ({ item }) => {
    const handleTaskPress = () => {
      Toast.show({
        type: "info",
        text1: "Cannot edit Completed Tasks",
        text2: "Make task incomplete first (Swipe Right)",
      });
    };
    const renderRightActions = () => (
      <TaskItemSwipeDelete onPress={() => deleteTask(item.id)} />
    );
    const renderLeftActions = () => (
      <TaskItemSwipeStatus onPress={() => updateTaskIncomplete(item.id)} />
    );

    return (
      <Swipeable
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
      >
        <TouchableOpacity onPress={() => handleTaskPress(item.id)}>
          <TaskItem
            taskId={item.id}
            renderRightActions={renderRightActions}
            style={styles.completedTaskCOntainer}
          />
        </TouchableOpacity>
      </Swipeable>
    );
  };
  if (completedTasks && completedTasks.length > 0) {
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
  } else {
    return null;
  }
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
