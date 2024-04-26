import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { create } from "zustand";
import { Audio } from "expo-av";

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
  sound: null,
  isPaused: true,
  startTime: null,
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
  initializeSound: async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sounds/achievement-bell.wav")
    );
    set({ sound });
  },
  playCompleteSound: async () => {
    const { sound } = get();
    if (sound) {
      await sound.replayAsync();
      await sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          await sound.unloadAsync();
          set({ sound: null });
        }
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
          remainingSeconds: (get().taskHours * 60 + get().taskMinutes) * 60,
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
      get().playCompleteSound();

      Toast.show(
        {
          type: "success",
          text1: `${currentTask.text} Complete!`,
          position: "bottom",
        },
        get().togglePause(),
        set({ activeTaskId: null })
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
  updateTimersOnForeground: () => {
    const now = new Date();
    const startTime = get().startTime;
    if (startTime) {
      const elapsedMs = now.getTime() - new Date(startTime).getTime();
      set((state) => ({
        tasks: state.tasks.map((task) => {
          if (task.timerActive) {
            const elapsedSeconds = Math.floor(elapsedMs / 1000);
            const newRemaining = Math.max(
              task.remainingSeconds - elapsedSeconds,
              0
            );
            // Update only if there's a significant change to prevent minor discrepancies
            if (Math.abs(newRemaining - task.remainingSeconds) > 1) {
              return {
                ...task,
                remainingSeconds: newRemaining,
              };
            }
          }
          return task;
        }),
      }));
    }
  },

  setStartTime: async (date) => {
    await AsyncStorage.setItem("startTime", JSON.stringify(date));
    set({ startTime: date });
  },

  clearStartTime: async () => {
    await AsyncStorage.removeItem("startTime");
    set({ startTime: null });
  },
  // TIMER LOGIC
  startTimer: (taskId) => {
    const now = new Date();
    set((state) => {
      const task = state.tasks.find((t) => t.id === taskId);
      if (!task) {
        console.error("Task not found");
        return;
      }

      if (get().intervalId !== null) {
        clearInterval(get().intervalId);
      }

      const startTime = now;
      const intervalId = setInterval(() => {
        const currentTime = new Date();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
        const newRemainingSeconds = task.remainingSeconds - elapsedSeconds;

        if (newRemainingSeconds <= 0) {
          clearInterval(intervalId);
          set((state) => ({
            intervalId: null,
            tasks: state.tasks.map((t) =>
              t.id === taskId
                ? { ...t, remainingSeconds: 0, timerActive: false }
                : t
            ),
          }));
          get().clearStartTime();
          get().updateTaskCompletion(taskId);
          get().calculateTotalCompletionTime();
        } else {
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === taskId
                ? { ...t, remainingSeconds: newRemainingSeconds }
                : t
            ),
          }));
        }
      }, 1000);

      return {
        activeTaskId: taskId,
        startTime,
        intervalId,
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, timerActive: true, startTime } : t
        ),
        completionTime: new Date(now.getTime() + task.remainingSeconds * 1000),
      };
    });
  },

  // Pausing the timer
  pauseTimer: (taskId) => {
    const now = new Date();
    clearInterval(get().intervalId);
    set({ intervalId: null });

    set((state) => {
      return {
        tasks: state.tasks.map((task) => {
          if (task.id === taskId && task.timerActive) {
            const elapsedSeconds = Math.floor(
              (now - new Date(task.startTime)) / 1000
            );
            const newRemaining = Math.max(
              task.remainingSeconds - elapsedSeconds,
              0
            );
            return {
              ...task,
              timerActive: false,
              remainingSeconds: newRemaining,
              startTime: now, // Update startTime to the current pause time
            };
          }
          return task;
        }),
      };
    });
  },

  calculateRemainingTime: (task) => {
    const now = new Date();
    const startTime = new Date(task.startTime);
    const elapsedMs = now - startTime;
    const elapsedSeconds = Math.floor(elapsedMs / 1000);
    return Math.max(task.durationSeconds - elapsedSeconds, 0);
  },

  calculateTotalCompletionTime: () => {
    const incompleteTasks = get().tasks.filter(
      (task) => task.taskStatus === "incomplete"
    );
    const totalRemainingSeconds = incompleteTasks.reduce(
      (sum, task) => sum + task.remainingSeconds,
      0
    );
    const currentTime = new Date();
    const totalFutureTime = new Date(
      currentTime.getTime() + totalRemainingSeconds * 1000
    );
    set({ totalCompletionTime: totalFutureTime });
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

  incrementTaskTime: async (incrementMinutes) => {
    const { activeTaskId, tasks } = get();
    const updatedTasks = tasks.map((task) => {
      if (task.id === activeTaskId && task.timerActive) {
        const additionalSeconds = incrementMinutes * 60;
        return {
          ...task,
          remainingSeconds: task.remainingSeconds + additionalSeconds,
          durationSeconds: task.durationSeconds + additionalSeconds,
        };
      }
      return task;
    });
    set({ tasks: updatedTasks });
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Unable to add time",
      });
    }
  },
}));

export default useTaskStore;
