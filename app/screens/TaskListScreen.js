import { View, Text, Button } from "react-native";
import IncompleteTaskList from "../components/IncompleteTaskList";
import useTaskStore from "../store/TaskStore";
import React, { useEffect, useState } from "react";
import CompletedTasks from "../components/CompletedTasks";
import AddTaskScreen from "./AddTaskScreen";
import BottomSheet from "../components/BottomSheet";
import AppButton from "../components/AppButton";

export default function TaskListScreen() {
  const { loadTasks } = useTaskStore();
  const { isBottomSheetVisible, toggleBottomSheetVisibility } = useTaskStore(
    (state) => ({
      isBottomSheetVisible: state.isBottomSheetVisible,
      toggleBottomSheetVisibility: state.toggleBottomSheetVisibility,
    })
  );

  useEffect(() => {
    loadTasks();
  }, []);
  return (
    <>
      <View style={{ flex: 1 }}>
        <AppButton title="Add Task" onPress={toggleBottomSheetVisibility} />
        <BottomSheet
          isVisible={isBottomSheetVisible}
          onClose={toggleBottomSheetVisibility}
        >
          <AddTaskScreen />
        </BottomSheet>
        <Text>Incomplete Tasks</Text>
        <IncompleteTaskList />
        <CompletedTasks />
      </View>
    </>
  );
}
