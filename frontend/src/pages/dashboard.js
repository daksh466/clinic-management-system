import { renderPatientList } from '../components/PatientList.js';
import { renderMedicineList } from '../components/MedicineList.js';
import { renderReminderList } from '../components/ReminderList.js';

export function renderDashboard() {
  const patientContainer = document.getElementById('patient-list');
  const medicineContainer = document.getElementById('medicine-list');
  const reminderContainer = document.getElementById('reminder-list');

  renderPatientList(patientContainer);
  renderMedicineList(medicineContainer);
  renderReminderList(reminderContainer);
}