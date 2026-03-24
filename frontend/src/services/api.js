const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';


export async function apiRequest(endpoint, options = {}) {
  const config = {
    method: (options.method || 'GET').toUpperCase(),
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', 
  };

  if (options.body) {
    config.body = options.body;
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config);

    if (res.status === 401) {
     
      throw new Error("Session expired");
    }

    if (res.status === 204) {
      return { success: true };
    }

    const contentType = res.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } else {
      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || 'Request failed');
      }

      return { success: true, message: text };
    }
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
}


// 🔥 FORM DATA REQUEST
export async function apiRequestFormData(endpoint, formData, options = {}) {
  const config = {
    method: (options.method || 'POST').toUpperCase(),
    body: formData,
    credentials: 'include',
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config);

    if (res.status === 401) {
     
      throw new Error("Session expired");
    }

    const contentType = res.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } else {
      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || 'Request failed');
      }

      return { success: true, message: text };
    }
  } catch (error) {
    console.error('FormData API Error:', error.message);
    throw error;
  }
}


// 🔥 SERVER HEALTH CHECK
export async function checkServerHealth() {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}