import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";

const BACKGROUND_FETCH_TASK = "background-fetch-task";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    // Do some background work
    // You can re-schedule notifications here
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Reminder",
        body: "Your task is still pending.",
      },
      trigger: { seconds: 60 },
    });

    return BackgroundFetch.Result.NewData;
  } catch (err) {
    return BackgroundFetch.Result.Failed;
  }
});

const registerBackgroundFetchAsync = async () => {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 15, // 15 minutes
    stopOnTerminate: false,
    startOnBoot: true,
  });
};

const unregisterBackgroundFetchAsync = async () => {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
};
