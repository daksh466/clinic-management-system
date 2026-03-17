import { renderMedicineList } from '../components/MedicineList.js';

export function renderMedicinesPage() {
  const container = document.getElementById('medicine-list');
  renderMedicineList(container);
}
