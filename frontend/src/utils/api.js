export const fetchVisitHistory = async (patientId) => {
  try {
    const response = await fetch(`https://clinic-management-system-1dy2.onrender.com/api/visits/patients/${patientId}/visits`);
    if (!response.ok) throw new Error('Failed to load visit history');
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const addVisit = async (visitData) => {
  try {
    const response = await fetch('https://clinic-management-system-1dy2.onrender.com/api/visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(visitData)
    });
    if (!response.ok) throw new Error('Failed to add visit');
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};
export const fetchPatients = async () => {
  const API_URL = 'https://clinic-management-system-1dy2.onrender.com';
  try {
    const response = await fetch(`${API_URL}/api/patients`);
    if (!response.ok) throw new Error('Failed to load patients');
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const fetchMedicines = async () => {
  const response = await fetch('/api/medicines');
  return response.json();
};

export const fetchReminders = async () => {
  const response = await fetch('/api/reminders');
  return response.json();
};