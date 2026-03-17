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