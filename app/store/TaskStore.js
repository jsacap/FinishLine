import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { create } from "zustand";

const useTaskStore = create((set, get) => ({
  tasks: [],
  taskInput: "",
  taskHours: 0,
  taskMinutes: 0,
  selectedTaskId: null,
  isBottomSheetVisible: false,

  setTaskInput: (input) => set({ taskInput: input }),
  setTaskHours: (hours) => set({ taskHours: hours }),
  setTaskMinutes: (minutes) =>
    set({
      taskMinutes: minutes % 60,
      taskHours: get().taskHours + Math.floor(minutes / 60),
    }),

  clearTaskInputs: () => set({ taskInput: "", taskHours: 0, taskMinutes: 0 }),

  loadTaskForEditing: (taskId) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (task) {
      set({
        taskInput: task.text,
        taskHours: Math.floor(task.durationMinutes / 60),
        taskMinutes: task.durationMinutes % 60,
        selectedTaskId: taskId,
      });
    }
  },

  updateTask: () => {
    const updatedTasks = get().tasks.map((t) => {
      if (t.id === get().selectedTaskId) {
        return {
          ...t,
          text: get().taskInput,
          durationMinutes: get().taskHours * 60 + get().taskMinutes,
        };
      }
      return t;
    });
    set({ tasks: updatedTasks, selectedTaskId: null });
    AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    get().clearTaskInputs();
    get().closeBottomSheet();
    Toast.show({
      type: "success",
      text1: "Task Edited!",
      position: "bottom",
    });
  },

  loadTasks: async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) {
        set({ tasks: JSON.parse(storedTasks) });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error Fetching Tasks...",
      });
    }
  },

  openBottomSheet: () => set({ isBottomSheetVisible: true }),
  closeBottomSheet: () => {
    set({
      isBottomSheetVisible: false,
      selectedTaskId: null,
    });
    get().clearTaskInputs();
  },

  addTask: () => {
    const newTask = {
      id: Date.now(),
      text: get().taskInput,
      hours: get().taskHours,
      minutes: get().taskMinutes,
      durationMinutes: get().taskHours * 60 + get().taskMinutes,
      durationSeconds: (get().taskHours * 60 + get().taskMinutes) * 60,
      timerActive: false,
      remainingSeconds: (get().taskHours * 60 + get().taskMinutes) * 60,
      taskStatus: "incomplete",
    };

    const updatedTasks = [...get().tasks, newTask];
    set({ tasks: updatedTasks });
    AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    get().clearTaskInputs();
    get().closeBottomSheet();
    Toast.show({
      type: "success",
      text1: "Task Added!",
      position: "bottom",
    });
  },

  deleteTask: (taskId) => {
    const updatedTasks = get().tasks.filter((task) => task.id !== taskId);
    set({ tasks: updatedTasks });
    AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    get().clearTaskInputs();
    get().closeBottomSheet();
    Toast.show({
      type: "success",
      text1: "Task Deleted Successfully",
      position: "bottom",
    });
  },

  startTimer: (taskId) => {
    const interval = setInterval(() => {
      const tasks = get().tasks.map((task) => {
        if (
          task.id === taskId &&
          task.timerActive &&
          task.remainingSeconds > 0
        ) {
          return { ...task, remainingSeconds: task.remainingSeconds - 1 };
        } else if (task.remainingSeconds === 0) {
          clearInterval(interval);
          return { ...task, taskStatus: "complete", timerActive: false };
        }
        return task;
      });
      set({ tasks });
    }, 1000);

    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, timerActive: true } : task
      ),
    }));
  },

  pauseTimer: (taskId) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, timerActive: false } : task
      ),
    }));
  },

  // Method to resume timer
  resumeTimer: (taskId) => {
    get().startTimer(taskId);
  },

  getCompletedTasks: () =>
    get().tasks.filter((task) => task.taskStatus === "complete"),
  getIncompleteTasks: () =>
    get().tasks.filter((task) => task.taskStatus === "incomplete"),
}));

export default useTaskStore;
