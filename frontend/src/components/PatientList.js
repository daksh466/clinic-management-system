import { fetchPatients } from '../utils/api.js';
import { PatientCard } from './PatientCard.js';

export async function renderPatientList(container) {
  const patients = await fetchPatients();
  if (patients.error) {
    container.innerHTML = `<div class="loading">${patients.error}</div>`;
    return;
  }
  container.innerHTML = patients.map(p => PatientCard(p)).join('');
}