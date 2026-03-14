// API Base URL (update if backend port changes)
const API_BASE = 'http://localhost:3000/api';

// Show loading
function showLoading(element) {
  if (!element) {
    console.error('showLoading: element is null');
    return;
  }
  element.innerHTML = '<div class="loading">Loading...</div>';
}

// Show error
function showError(element, message) {
  if (!element) {
    console.error('showError: element is null', message);
    return;
  }
  element.innerHTML = `<div class="error">${message}</div>`;
}

// Show success
function showSuccess(element, message) {
  const div = document.createElement('div');
  div.className = 'success';
  div.textContent = message;
  element.insertBefore(div, element.firstChild);
  setTimeout(() => div.remove(), 5000);
}

// Helpers
function parseNumber(value) {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

// Fetch all patients
async function fetchPatients(tableBody) {
  if (!tableBody) {
    console.error('fetchPatients: tableBody is null');
    return;
  }
  try {
    showLoading(tableBody);
    const response = await fetch(`${API_BASE}/patients`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    renderPatientsTable(tableBody, data.patients || []);
  } catch (error) {
    let errorMsg = 'Failed to load patients';
    if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
      errorMsg = 'Server not running. Start backend: cd ../backend && npm run dev';
    } else {
      errorMsg += ': ' + error.message;
    }
    showError(tableBody, errorMsg);
  }
}

// Render patients table
function renderPatientsTable(tableBody, patients) {
  tableBody.innerHTML = '';
  patients.forEach(patient => {
    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${patient.name}</td>
      <td>${patient.age}</td>
      <td>${patient.phone}</td>
      <td>${patient.disease}</td>
      <td>${patient.medicines || ''}</td>
      <td>${patient.parhej || ''}</td>
      <td>${patient.precautions || ''}</td>
      <td>${patient.course_duration_days} days</td>
      <td>${patient.start_date}</td>
      <td>${patient.end_date}</td>
      <td>
        <button class="btn btn-edit" onclick="editPatient(${patient.id})">Edit</button>
        <button class="btn btn-danger" onclick="deletePatient(${patient.id})" style="margin-left: 0.5rem;">Delete</button>
      </td>
    `;
  });
}

// Add new patient
async function addPatient(form) {
  if (!form || !form.parentElement) {
    console.error('addPatient: form or parent missing');
    return;
  }
  const formData = new FormData(form);
  const patientData = Object.fromEntries(formData);

  // Convert numeric fields to numbers (or null) to avoid string issues
  patientData.age = parseNumber(patientData.age);
  patientData.course_duration_days = parseNumber(patientData.course_duration_days);

  try {
    const response = await fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData)
    });
    
    if (response.ok) {
      showSuccess(form.parentElement, 'Patient added successfully!');
      form.reset();
      // Refresh table
      const tableBody = document.querySelector('#patients-table tbody');
      if (tableBody) fetchPatients(tableBody);
    } else {
      let errorMsg = 'Failed to add patient';
      try {
        const error = await response.json();
        if (error.errors) {
          errorMsg = Array.isArray(error.errors) ? error.errors.join('; ') : JSON.stringify(error.errors);
        } else {
          errorMsg = error.error || errorMsg;
        }
      } catch {}
      showError(form.parentElement, errorMsg);
    }
  } catch (error) {
    let errorMsg = 'Network error';
    if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
      errorMsg = 'Server not running. Start backend first.';
    } else {
      errorMsg += ': ' + error.message;
    }
    showError(form.parentElement, errorMsg);
  }
}

// Delete patient
async function deletePatient(id) {
  if (!confirm('Delete this patient?')) return;
  
  try {
    const response = await fetch(`${API_BASE}/patients/${id}`, { method: 'DELETE' });
    if (response.ok) {
      showSuccess(document.body, 'Patient deleted!');
      const tableBody = document.querySelector('#patients-table tbody');
      if (tableBody) fetchPatients(tableBody);
    }
  } catch (error) {
    alert('Error deleting patient: ' + error.message);
  }
}

// Edit patient (placeholder - implement modal/form population)
function editPatient(id) {
  alert(`Edit patient ${id} - Implement edit form/modal`);
}

// Fetch medicines
async function fetchMedicines(tableBody) {
  try {
    showLoading(tableBody);
    const response = await fetch(`${API_BASE}/medicines`);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    const data = await response.json();
    renderMedicinesTable(tableBody, data.medicines || []);
  } catch (error) {
    showError(tableBody, 'Failed to load medicines: ' + error.message);
  }
}

// Render medicines table
function renderMedicinesTable(tableBody, medicines) {
  tableBody.innerHTML = '';
  medicines.forEach(medicine => {
    const row = tableBody.insertRow();
    const lowStockClass = medicine.low_stock ? 'low-stock' : '';
    row.className = lowStockClass;
    row.innerHTML = `
      <td>${medicine.medicine_name}</td>
      <td>${medicine.quantity}</td>
      <td>${medicine.expiry_date}</td>
      <td>${medicine.low_stock ? '⚠️ LOW STOCK' : 'OK'}</td>
    `;
  });
}

// Add medicine
async function addMedicine(form) {
  const formData = new FormData(form);
  const medicineData = Object.fromEntries(formData);

  // Convert numeric fields to numbers
  medicineData.quantity = parseNumber(medicineData.quantity);

  try {
    const response = await fetch(`${API_BASE}/medicines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medicineData)
    });
    
    if (response.ok) {
      showSuccess(form.parentElement, 'Medicine added successfully!');
      form.reset();
      const tableBody = document.querySelector('#medicines-table tbody');
      if (tableBody) fetchMedicines(tableBody);
    } else {
      const error = await response.json();
      let msg = 'Failed to add medicine';
      if (error.errors) {
        msg = Array.isArray(error.errors) ? error.errors.join('; ') : JSON.stringify(error.errors);
      } else if (error.error) {
        msg = error.error;
      }
      showError(form.parentElement, msg);
    }
  } catch (error) {
    showError(form.parentElement, 'Network error: ' + error.message);
  }
}

// Fetch reminders for dashboard
async function fetchReminders(container) {
  try {
    showLoading(container);
    const response = await fetch(`${API_BASE}/reminders`);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    const data = await response.json();
    
    const todayCount = data.summary ? data.summary.today : 0;
    const lowStockCount = 0; // Will update with medicines
    
    container.innerHTML = `
      <div class="card">
        <h3>Today's Reminders (${todayCount})</h3>
        ${data.reminders && data.reminders.length ? 
          data.reminders.slice(0, 5).map(r => 
            `<div class="reminder-today"><strong>${r.name}</strong> - ${r.phone} (${r.disease}) ends ${r.end_date}</div>`
          ).join('') : 
          '<p>No reminders today</p>'
        }
      </div>
    `;
  } catch (error) {
    showError(container, 'Failed to load reminders');
  }
}

// Fetch dashboard stats
async function loadDashboard() {
  const totalPatientsContainer = document.querySelector('#total-patients');
  const remindersContainer = document.querySelector('#reminders-container');
  const lowStockContainer = document.querySelector('#low-stock-container');
  
  try {
    // Total patients
    const patientsRes = await fetch(`${API_BASE}/patients`);
    if (!patientsRes.ok) throw new Error(`HTTP ${patientsRes.status}`);
    const patientsData = await patientsRes.json();
    totalPatientsContainer.textContent = patientsData.patients ? patientsData.patients.length : 0;
    
    // Reminders
    fetchReminders(remindersContainer);
    
    // Low stock (fetch medicines)
    const medsRes = await fetch(`${API_BASE}/medicines/low-stock`);
    if (!medsRes.ok) throw new Error(`HTTP ${medsRes.status}`);
    const medsData = await medsRes.json();
    const lowStockCount = medsData.low_stock_medicines ? medsData.low_stock_medicines.length : 0;
    document.querySelector('#low-stock-count').textContent = lowStockCount;
    
  } catch (error) {
    console.error('Dashboard load error:', error);
  }
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', () => {
  const patientsForm = document.getElementById('patient-form');
  const medicinesForm = document.getElementById('medicine-form');
  const patientsTable = document.querySelector('#patients-table tbody');
  const medicinesTable = document.querySelector('#medicines-table tbody');
  
  if (patientsForm) patientsForm.addEventListener('submit', e => { e.preventDefault(); addPatient(patientsForm); });
  if (medicinesForm) medicinesForm.addEventListener('submit', e => { e.preventDefault(); addMedicine(medicinesForm); });
  if (patientsTable) fetchPatients(patientsTable);
  if (medicinesTable) fetchMedicines(medicinesTable);
  if (document.getElementById('dashboard')) loadDashboard();
});

