import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
// store/useTasksStore.js

const useTasksStore = create((set, get) => ({
  tasks: [],
  currentTaskIndex: 0,
  remainingTime: 0,
  countdownActive: false,
  setEditTask: (task) => set({ setEditTask: task }),

  fetchTasks: async () => {
    const tasksString = await AsyncStorage.getItem("tasks");
    const tasks = tasksString ? JSON.parse(tasksString) : [];
    set({ tasks });
  },
  addOrUpdateTask: async (task) => {
    const tasks = get().tasks;
    const taskIndex = tasks.findIndex((t) => t.id === task.id);
    const newTasks =
      taskIndex === -1
        ? [...tasks, task]
        : tasks.map((t) => (t.id === task.id ? { ...t, ...task } : t));
    await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
    set({ tasks: newTasks });
  },

  initializeTimer: () => {
    const tasks = get().tasks;
    if (tasks.length > 0 && tasks[0].taskStatus === "incomplete") {
      set({
        remainingTime: tasks[0].durationMinutes * 60,
        currentTaskIndex: 0,
        countdownActive: true,
      });
    }
  },

  tick: () => {
    const { remainingTime, tasks, currentTaskIndex } = get();
    if (remainingTime > 0) {
      set({ remainingTime: remainingTime - 1 });
    } else if (tasks[currentTaskIndex].taskStatus === "incomplete") {
      const updatedTasks = tasks.map((task, index) =>
        index === currentTaskIndex ? { ...task, taskStatus: "completed" } : task
      );
      set({ tasks: updatedTasks });
      AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));

      // Move to the next incomplete task
      const nextTaskIndex = updatedTasks.findIndex(
        (task, index) =>
          index > currentTaskIndex && task.taskStatus === "incomplete"
      );
      if (nextTaskIndex !== -1) {
        set({
          currentTaskIndex: nextTaskIndex,
          remainingTime: updatedTasks[nextTaskIndex].durationMinutes * 60,
        });
      } else {
        set({ countdownActive: false });
      }
    }
  },

  toggleCountdown: () => {
    const { countdownActive } = get();
    set({ countdownActive: !countdownActive });
  },
}));

export default useTasksStore;
