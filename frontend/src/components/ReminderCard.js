export function ReminderCard(reminder) {
  return `<div class="reminder-card">
    <div><strong>Message:</strong> ${reminder.message}</div>
    <div><strong>Date:</strong> ${reminder.date}</div>
  </div>`;
}
