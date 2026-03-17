import { renderVisitHistory } from './VisitHistory.js';

export function PatientCard(patient) {
  return `<div class="patient-card">
    <div><strong>Name:</strong> ${patient.name}</div>
    <div><strong>Age:</strong> ${patient.age}</div>
    <div><strong>Disease:</strong> ${patient.disease}</div>
    <div id="visit-history-${patient.id}"></div>
  </div>`;
}

export function renderPatientDetails(patient) {
  const container = document.getElementById(`visit-history-${patient.id}`);
  if (container) renderVisitHistory(container, patient.id);
}
