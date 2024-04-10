import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const handleTaskDelete = async (
  taskId,
  tasks,
  setTasks,
  SetEditTask,
  toggleBottomSheet
) => {
  const updatedTasks = tasks.filter((task) => task.id !== taskId);
  setTasks(updatedTasks);
  await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
  SetEditTask(null);
  toggleBottomSheet();
  Toast.show({
    type: "success",
    text1: "Task Deleted",
    position: "bottom",
  });
};
