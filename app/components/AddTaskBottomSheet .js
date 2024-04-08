import React, { useState } from "react";
import { View, TouchableOpacity, FlatList } from "react-native";
import AppButton from "./AppButton";
import BottomSheet from "./BottomSheet";
import TaskItem from "./TaskItem";
import AddTaskScreen from "../screens/AddTaskScreen";

function AddTaskBottomSheet({ tasks, onTaskUpdate }) {
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const toggleBottomSheet = () => setBottomSheetVisible(!isBottomSheetVisible);

  const handleTaskSelect = (task, remainingMinutes) => {
    setCurrentTask({ ...task, remainingMinutes });
    toggleBottomSheet();
  };

  return (
    <View>
      <AppButton title="Add Task" onPress={() => handleTaskSelect({})} />
      {tasks.length > 0 && (
        <FlatList
          data={tasks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() =>
                handleTaskSelect(item /* Calculated remainingMinutes here */)
              }
            >
              {/* TaskItem rendering */}
            </TouchableOpacity>
          )}
        />
      )}
      <BottomSheet isVisible={isBottomSheetVisible} onClose={toggleBottomSheet}>
        <AddTaskScreen
          task={currentTask}
          onTaskSubmit={() => {
            onTaskUpdate();
            toggleBottomSheet();
          }}
          onTaskCancel={toggleBottomSheet}
        />
      </BottomSheet>
    </View>
  );
}

export default AddTaskBottomSheet;
