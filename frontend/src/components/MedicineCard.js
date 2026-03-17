export function MedicineCard(medicine) {
  return `<div class="medicine-card">
    <div><strong>Name:</strong> ${medicine.name}</div>
    <div><strong>Type:</strong> ${medicine.type}</div>
    <div><strong>Stock:</strong> ${medicine.stock}</div>
  </div>`;
}
