import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  scheduleTaskProgressNotifications,
  scheduleNotification,
} from "../notificationUtils";
import * as Notifications from "expo-notifications";

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
  iconName: "",
  setIconName: (iconName) => set({ iconName }),
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
  // Load and prepare the sound
  initializeSound: async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/achievement-bell.wav"),
        { shouldPlay: false }
      );
      set({ sound });
    } catch (error) {
      console.error("Failed to load sound", error);
    }
  },

  // Play the complete sound
  playCompleteSound: async () => {
    const { sound } = get();
    if (!sound) {
      console.log("Sound not loaded or already unloaded");
      return;
    }

    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && !status.isPlaying) {
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate(async (status) => {
          if (status.didJustFinish) {
            await sound.unloadAsync();
            set({ sound: null });
          }
        });
      }
    } catch (error) {
      console.error("Failed to play or manage sound", error);
      try {
        await sound.unloadAsync();
      } catch (e) {
        console.error("Failed to unload sound", e);
      }
      set({ sound: null });
    }
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
    const { taskInput, taskHours, taskMinutes, iconName, tasks } = get();

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
      text: taskInput,
      hours: taskHours,
      minutes: taskMinutes,
      durationMinutes: taskHours * 60 + taskMinutes,
      durationSeconds: (taskHours * 60 + taskMinutes) * 60,
      timerActive: false,
      remainingSeconds: (taskHours * 60 + taskMinutes) * 60,
      taskStatus: "incomplete",
      iconName: iconName, // Use destructured iconName
    };

    const updatedTasks = [...tasks, newTask];
    set({ tasks: updatedTasks, iconName: "" });
    AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    get().clearTaskInputs();
    get().closeBottomSheet();
    Toast.show({
      type: "success",
      text1: "Task Added!",
      position: "bottom",
    });
  },

  updateTask: () => {
    const {
      tasks,
      selectedTaskId,
      taskHours,
      taskMinutes,
      taskInput,
      cancelNotification,
    } = get();
    const selectedTask = tasksr.find((t) => t.id === selectedTaskId);
    const newDurationSeconds = (taskHours * 60 + taskMinutes) * 60;

    if (!selectedTask) return; // Exit if no task is found

    let taskUpdated = false;
    const updatedTasks = tasks.map((t) => {
      if (t.id === selectedTaskId) {
        // Always update these properties
        const updatedTask = {
          ...t,
          text: taskInput,
          durationMinutes: taskHours * 60 + taskMinutes,
          remainingSeconds: newDurationSeconds,
        };

        // Check if the duration has changed to decide on notification handling
        if (t.remainingSeconds !== newDurationSeconds) {
          if (t.halfwayNotificationId && t.ninetyPercentNotificationId) {
            cancelNotification(t.halfwayNotificationId);
            cancelNotification(t.ninetyPercentNotificationId);
          }

          // Reschedule notifications
          scheduleTaskProgressNotifications(updatedTask)
            .then((notificationIds) => {
              // Integrate new notification IDs
              Object.assign(updatedTask, notificationIds);
            })
            .catch((error) => {
              console.error("Error scheduling new notifications:", error);
            });
        }

        taskUpdated = true; // Flag to know that task was updated
        return updatedTask;
      }
      return t;
    });

    if (taskUpdated) {
      set({ tasks: updatedTasks });
      AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }

    get().clearTaskInputs();
    get().closeBottomSheet();
    Toast.show({
      type: "success",
      text1: "Task Edited!",
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
  cancelNotification: async (notificationId) => {
    if (typeof notificationId === "string" && notificationId.trim() !== "") {
      await Notifications.cancelScheduledNotificationAsync(
        notificationId
      ).catch((error) => {
        console.error(
          "Failed to cancel notification with ID:",
          notificationId,
          error
        );
      });
    } else {
      console.warn(
        "Attempted to cancel a notification with an invalid ID:",
        notificationId
      );
    }
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
            remainingSeconds: task.durationSeconds,
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
      get().togglePause();

      Toast.show({
        type: "success",
        text1: `${currentTask.text} Complete!`,
        position: "bottom",
      });
      set({ activeTaskId: null });
      get().togglePause();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to save the tasks",
        text2: error.message,
      });
    }
  },
  updateTaskIncomplete: async (taskId) => {
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
            taskStatus: "incomplete",
            // remainingSeconds: 0,
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
          text1: `${currentTask.text} Marked Incomplete!`,
          position: "bottom",
        },
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

      if (task.notificationId) {
        Notifications.cancelScheduledNotificationAsync(task.notificationId);
      }

      scheduleNotification(task, task.remainingSeconds).then(
        (notificationId) => {
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === taskId ? { ...t, notificationId } : t
            ),
          }));
        }
      );

      // Schedule notifications for 50% and 90% task completion
      scheduleTaskProgressNotifications(task).then((notificationIds) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, ...notificationIds } : t
          ),
        }));
      });

      const startTime = now;
      const intervalId = setInterval(() => {
        const currentTime = new Date();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);

        const newRemainingSeconds = task.remainingSeconds - elapsedSeconds;
        if (newRemainingSeconds <= 0) {
          get().togglePause(), clearInterval(intervalId);
          if (task.notificationId) {
            Notifications.cancelScheduledNotificationAsync(
              task.notificationId
            ).catch((error) => {
              console.error("Failed to cancel notification", error);
            });
          }

          set((state) => ({
            intervalId: null,
            tasks: state.tasks.map((t) =>
              t.id === taskId
                ? {
                    ...t,
                    remainingSeconds: 0,
                    timerActive: false,
                    notificationId: undefined,
                  }
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
