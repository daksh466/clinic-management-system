import { renderReminderList } from '../components/ReminderList.js';

export function renderRemindersPage() {
  const container = document.getElementById('reminder-list');
  renderReminderList(container);
}
