import { fetchReminders } from '../utils/api.js';
import { ReminderCard } from './ReminderCard.js';

export async function renderReminderList(container) {
  const reminders = await fetchReminders();
  container.innerHTML = reminders.map(r => ReminderCard(r)).join('');
}
