export const state = {
  patients: [],
  clinics: [],
  user: null,
};

export function setPatients(patients) {
  state.patients = patients;
}

export function setUser(user) {
  state.user = user;
}
