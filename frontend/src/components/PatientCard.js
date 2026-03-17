export function PatientCard(patient) {
  return `<div class="patient-card">
    <div><strong>Name:</strong> ${patient.name}</div>
    <div><strong>Age:</strong> ${patient.age}</div>
    <div><strong>Disease:</strong> ${patient.disease}</div>
  </div>`;
}
