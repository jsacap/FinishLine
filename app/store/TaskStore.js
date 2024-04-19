import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { create } from "zustand";

const useTaskStore = create((set, get) => ({
  tasks: [],
  taskInput: "",
  taskHours: 0,
  taskMinutes: 0,
  selectedTaskId: null,
  intervalId: null,
  activeTaskId: null,
  completionTime: null,
  isBottomSheetVisible: false,
  isPaused: true,
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

  // CRUD
  addTask: () => {
    // validation
    const taskInput = get().taskInput;
    const taskHours = get().taskHours;
    const taskMinutes = get().taskMinutes;
    if (!taskInput.trim()) {
      Toast.show({
        type: "error",
        text1: "Task Name Cannot Be Empty",
      });
      return;
    }
    if (taskHours === 0 && taskMinutes === 0) {
      Toast.show({
        type: "error",
        text1: "Must Set an Estimated Time",
      });
      return;
    }
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
    console.log(updatedTasks);
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
  updateTaskCompletion: async (taskId) => {
    const currentTask = get().tasks.find((task) => task.id === taskId);
    if (!currentTask) {
      Toast.show({
        type: "error",
        text1: "Task not found",
      });
      return;
    }
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            timerActive: false,
            taskStatus: "complete",
            remainingSeconds: 0,
          };
        }
        return task;
      }),
    }));
    await new Promise((resolve) => setTimeout(resolve, 0));
    const updatedTasks = get().tasks;
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
      Toast.show(
        {
          type: "success",
          text1: `${currentTask.text} Complete!`,
          position: "bottom",
        },
        get().togglePause(),
        set({ activeTaskId: nulll })
      );
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to save the tasks",
        text2: error.message,
      });
    }
  },

  // timer logic
  startTimer: (taskId) => {
    set((state) => ({
      activeTaskId: taskId,
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, timerActive: true } : task
      ),
    }));
    if (get().intervalId !== null) {
      clearInterval(get().intervalId);
    }
    const intervalId = setInterval(() => {
      const task = get().tasks.find((t) => t.id === taskId);
      if (task && task.timerActive && task.remainingSeconds > 0) {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, remainingSeconds: t.remainingSeconds - 1 }
              : t
          ),
          completionTime: new Date(
            new Date().getTime() + task.remainingSeconds * 1000
          ),
        }));
      } else {
        clearInterval(intervalId);
        set({ intervalId: null, completionTime: null });
        if (task && task.remainingSeconds === 0) {
          get().updateTaskCompletion(taskId);
        }
      }
    }, 1000);
    set({ intervalId });
  },

  pauseTimer: (taskId) => {
    clearInterval(get().intervalId);
    set({ intervalId: null });
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, timerActive: false } : task
      ),
    }));
  },

  resumeTimer: (taskId) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (task && !task.timerActive && task.remainingSeconds > 0) {
      get().startTimer(taskId); // Reuse startTimer to reinitiate the interval
    }
  },

  getCompletedTasks: () =>
    get().tasks.filter((task) => task.taskStatus === "complete"),
  getIncompleteTasks: () =>
    get().tasks.filter((task) => task.taskStatus === "incomplete"),

  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
}));

export default useTaskStore;
