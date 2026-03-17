import { fetchMedicines } from '../utils/api.js';
import { MedicineCard } from './MedicineCard.js';

export async function renderMedicineList(container) {
  const medicines = await fetchMedicines();
  container.innerHTML = medicines.map(m => MedicineCard(m)).join('');
}
