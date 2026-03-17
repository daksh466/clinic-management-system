import { renderPatientList } from '../components/PatientList.js';

export function renderPatientsPage() {
  const container = document.getElementById('patient-list');
  renderPatientList(container);
}
