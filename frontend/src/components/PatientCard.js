import { renderVisitHistory } from './VisitHistory.js';

export function PatientCard(patient) {
  return `<div class="patient-card">
    <div><strong>Name:</strong> ${patient.name}</div>
    <div><strong>Age:</strong> ${patient.age}</div>
    <div><strong>Disease:</strong> ${patient.disease}</div>
    <button class="btn btn-primary" style="margin: 1rem 0;" onclick="toggleVisitHistory(${patient.id})">Visit History</button>
    <div id="visit-history-${patient.id}" style="display:none;"></div>
  </div>`;
}

export function renderPatientDetails(patient) {
  window.toggleVisitHistory = window.toggleVisitHistory || function(pid) {
    const container = document.getElementById(`visit-history-${pid}`);
    if (!container) return;
    if (container.style.display === 'none' || container.style.display === '') {
      renderVisitHistory(container, pid);
      container.style.display = 'block';
    } else {
      container.style.display = 'none';
    }
  };
}
}
