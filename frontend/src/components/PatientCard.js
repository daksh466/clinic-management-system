import { renderVisitHistory } from './VisitHistory.js';

export function PatientCard(patient) {
  return `<div class="patient-card">
    <div><strong>Name:</strong> ${patient.name}</div>
    <div><strong>Age:</strong> ${patient.age}</div>
    <div><strong>Disease:</strong> ${patient.disease}</div>
    <div style="display: flex; gap: 0.5rem; margin: 1rem 0;">
      <button class="btn btn-primary" onclick="toggleVisitHistory(${patient.id})">Visit History</button>
      <button class="btn btn-secondary" onclick="toggleAddVisitForm(${patient.id})">Add Visit</button>
    </div>
    <div id="visit-history-${patient.id}" style="display:none;"></div>
    <div id="add-visit-form-${patient.id}" style="display:none;"></div>
  </div>`;

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

  window.toggleAddVisitForm = window.toggleAddVisitForm || function(pid) {
    const formContainer = document.getElementById(`add-visit-form-${pid}`);
    if (!formContainer) return;
    if (formContainer.style.display === 'none' || formContainer.style.display === '') {
      // Dynamically import and render the add visit form only
      import('./VisitHistory.js').then(mod => {
        mod.renderVisitHistory(
          {
            set innerHTML(html) { formContainer.innerHTML = html; },
            get innerHTML() { return formContainer.innerHTML; }
          },
          pid
        );
        formContainer.style.display = 'block';
      });
    } else {
      formContainer.style.display = 'none';
    }
  };
}
}
