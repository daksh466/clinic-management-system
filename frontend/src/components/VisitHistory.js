import { fetchVisitHistory, addVisit } from '../utils/api.js';

export async function renderVisitHistory(container, patientId) {
  container.innerHTML = '<div class="loading">Loading visit history...</div>';
  const visits = await fetchVisitHistory(patientId);
  if (visits.error) {
    container.innerHTML = `<div class="error">${visits.error}</div>`;
    return;
  }
  if (!visits.length) {
    container.innerHTML = '<div style="text-align:center;padding:1rem;">No visits found</div>';
    return;
  }
  container.innerHTML = `
    <h3>Visit History</h3>
    <ul>
      ${visits.map(v => `<li>${new Date(v.visit_date).toLocaleDateString()} - ${v.diagnosis || 'No diagnosis'}<br><small>${v.notes || ''}</small></li>`).join('')}
    </ul>
    <div id="add-visit-form"></div>
  `;
  renderAddVisitForm(document.getElementById('add-visit-form'), patientId, () => renderVisitHistory(container, patientId));
}

export function renderAddVisitForm(formContainer, patientId, onSuccess) {
  formContainer.innerHTML = `
    <h4>Add Visit</h4>
    <form id="visit-form">
      <input type="text" name="diagnosis" placeholder="Diagnosis" required>
      <input type="text" name="medicines" placeholder="Medicines">
      <textarea name="notes" placeholder="Notes"></textarea>
      <button type="submit" class="btn btn-primary">Add Visit</button>
    </form>
  `;
  const form = formContainer.querySelector('#visit-form');
  form.onsubmit = async e => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(form));
    formData.patient_id = patientId;
    const result = await addVisit(formData);
    if (result.error) {
      formContainer.innerHTML += `<div class="error">${result.error}</div>`;
    } else {
      onSuccess();
    }
  };
}
