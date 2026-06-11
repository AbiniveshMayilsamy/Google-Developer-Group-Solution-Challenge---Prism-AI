const BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001';

function getToken() {
  try {
    const stored = localStorage.getItem('prism_user');
    return stored ? JSON.parse(stored).token : null;
  } catch {
    return null;
  }
}

export async function api(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || data.error || `Request failed: ${res.status}`);
  }
  return data;
}

export const apiGet  = (path)         => api(path, { method: 'GET' });
export const apiPost = (path, body)   => api(path, { method: 'POST',  body: JSON.stringify(body) });
export const apiDel  = (path)         => api(path, { method: 'DELETE' });
