import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  scheduleTaskProgressNotifications,
  scheduleNotification,
} from "../notificationUtils";
import * as Notifications from "expo-notifications";

import Toast from "react-native-toast-message";
import { create } from "zustand";
import { Audio } from "expo-av";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

const useTaskStore = create((set, get) => ({
  tasks: [],
  incompleteTasks: [],
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
    try {
      const { sound: existingSound } = get();

      if (existingSound) {
        await existingSound.unloadAsync();
        set({ sound: null });
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/achievement-bell.wav"),
        { shouldPlay: false }
      );

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          await sound.unloadAsync();
          set({ sound: null });
        }
      });

      await sound.playAsync();
      set({ sound });
    } catch (error) {
      console.error("Failed to play or manage sound", error);
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
    const { tasks, selectedTaskId } = get();
    const task = tasks.find((t) => t.id === selectedTaskId);

    if (task) {
      // Cancel existing notifications
      get().cancelNotification(task.notificationId);
      get().cancelNotification(task.halfwayNotificationId);
      get().cancelNotification(task.ninetyPercentNotificationId);
    }

    const updatedTasks = tasks.map((t) => {
      if (t.id === selectedTaskId) {
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

    if (task) {
      get().handleTaskNotifications(task.id);
    }
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
  pauseTimer: async (taskId) => {
    const now = new Date();
    clearInterval(get().intervalId);
    set({ intervalId: null });

    try {
      await Notifications.cancelAllScheduledNotificationsAsync(); // Cancel all notifications
    } catch (error) {
      console.error("Failed to cancel all notifications", error);
    }

    set(async (state) => {
      const updatedTasks = state.tasks.map((task) => {
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
            startTime: now,
            notificationId: undefined,
            halfwayNotificationId: undefined,
            ninetyPercentNotificationId: undefined,
          };
        }
        return task;
      });

      // Update AsyncStorage with the new tasks array
      await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));

      return { tasks: updatedTasks };
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
  getIncompleteTasks: () => get().tasks.filter((task) => !task.isComplete),

  getIncompleteTasks: () =>
    get().tasks.filter((task) => task.taskStatus === "incomplete"),

  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),

  incrementTaskTime: async (incrementMinutes) => {
    const { activeTaskId, tasks } = get();
    const task = tasks.find((t) => t.id === activeTaskId);

    get().togglePause();
    get().pauseTimer(activeTaskId);

    if (task) {
      // Cancel existing notifications
      get().cancelNotification(task.notificationId);
      get().cancelNotification(task.halfwayNotificationId);
      get().cancelNotification(task.ninetyPercentNotificationId);
    }

    const updatedTasks = tasks.map((task) => {
      if (task.id === activeTaskId) {
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
      if (task) {
        get().handleTaskNotifications(task.id);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Unable to add time",
      });
    }
  },
  handleTaskNotifications: async (taskId) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task) {
      console.error("Task not found");
      return;
    }
    if (task.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(task.notificationId);
    }
    if (task.halfwayNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        task.halfwayNotificationId
      );
    }
    if (task.ninetyPercentNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        task.ninetyPercentNotificationId
      );
    }
    if (get().activeTaskId === taskId) {
      const notificationId = await scheduleNotification(
        task,
        task.remainingSeconds
      );
      const notificationIds = await scheduleTaskProgressNotifications(task);
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                notificationId,
                halfwayNotificationId: notificationIds
                  ? notificationIds.halfwayNotificationId
                  : undefined,
                ninetyPercentNotificationId: notificationIds
                  ? notificationIds.ninetyPercentNotificationId
                  : undefined,
              }
            : t
        ),
      }));
    }
  },

  moveTaskUp: (taskId) => {
    set((state) => {
      const index = state.tasks.findIndex((t) => t.id === taskId);
      if (index > 0) {
        const newTasks = [...state.tasks];
        [newTasks[index], newTasks[index - 1]] = [
          newTasks[index - 1],
          newTasks[index],
        ];

        const activeTask = newTasks.find((t) => t.timerActive);
        if (activeTask) {
          get().pauseTimer(activeTask.id);
          get().togglePause();
        }

        return { tasks: newTasks };
      }
    });
  },
  clearAllTasks: async () => {
    try {
      await AsyncStorage.removeItem("tasks");
      set({ tasks: [] });
      Toast.show({
        type: "success",
        text1: "All tasks cleared!",
        position: "bottom",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to clear tasks",
        text2: error.message,
      });
    }
  },
}));

export default useTaskStore;
