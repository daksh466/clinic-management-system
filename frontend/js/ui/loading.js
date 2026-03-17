function showLoading(selector) {
  const el = document.querySelector(selector);
  if (el) {
    el.innerHTML = '<div class="loading">Loading...</div>';
  }
}

function hideLoading(selector) {
  const el = document.querySelector(selector);
  if (el) {
    el.innerHTML = '';
  }
}

export { showLoading, hideLoading };
