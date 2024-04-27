import * as Notifications from "expo-notifications";

export async function scheduleNotification(task, delaySeconds) {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Task Complete!",
        body: `${task.text} is now complete. Great job! 🎉`,
        data: { taskId: task.id },
      },
      trigger: { seconds: delaySeconds },
    });
    return notificationId;
  } catch (error) {
    console.error("Failed to schedule notification", error);
    return null; // Handle error as appropriate for your use case
  }
}
