import * as Notifications from "expo-notifications";

export async function scheduleTaskProgressNotifications(task) {
  const durationSeconds = task.durationMinutes * 60;
  if (durationSeconds >= 300) {
    // Only schedule if the duration is 5 minutes or longer
    const halfwaySeconds = Math.floor(durationSeconds * 0.5);
    const ninetyPercentSeconds = Math.floor(durationSeconds * 0.9);

    try {
      // Schedule notification for when 50% of the time is left
      const halfwayNotificationId =
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "TimeStack",
            body: `Halfway through: ${task.text}`,
            data: { taskId: task.id },
          },
          trigger: { seconds: halfwaySeconds },
        });

      // Schedule notification for when 90% of the time is left
      const ninetyPercentNotificationId =
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "TimeStack",
            body: `Almost done with: ${task.text}`,
            data: { taskId: task.id },
          },
          trigger: { seconds: ninetyPercentSeconds },
        });

      return { halfwayNotificationId, ninetyPercentNotificationId };
    } catch (error) {
      return null;
    }
  }
}

export async function scheduleNotification(task, delaySeconds) {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "TimeStack",
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
