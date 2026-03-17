const API_URL =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://clinic-management-system-1dy2.onrender.com";

async function apiFetch(url, options = {}, retries = 3) {
  try {
    const response = await fetch(API_URL + url, options);
    if (!response.ok) throw new Error("API error");
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 500));
      return apiFetch(url, options, retries - 1);
    }
    console.error("API Error:", error);
    throw error;
  }
}

export { API_URL, apiFetch };
