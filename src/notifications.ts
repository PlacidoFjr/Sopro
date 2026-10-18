import * as Notifications from 'expo-notifications';

const REMINDER_KIND = 'daily-devotional-reminder';

export async function scheduleDailyReminder(hour: number, minute: number) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const existingReminders = scheduled.filter(
    (item) => item.content.data?.kind === REMINDER_KIND,
  );
  const nextIdentifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Um momento para respirar',
      body: 'Sua leitura de hoje está esperando por você.',
      data: { kind: REMINDER_KIND, url: '/' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });

  try {
    await Promise.all(
      existingReminders.map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier)),
    );
  } catch (error) {
    await Notifications.cancelScheduledNotificationAsync(nextIdentifier).catch(() => undefined);
    throw error;
  }
  return nextIdentifier;
}

export async function cancelDailyReminder() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const reminders = scheduled.filter(
    (item) => item.content.data?.kind === REMINDER_KIND,
  );
  await Promise.all(reminders.map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier)));
}
