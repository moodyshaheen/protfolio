// API Configuration
// استبدل الرابط التالي برابط الباك إند على Render بعد النشر
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  projects: `${API_URL}/api/projects`,
  uploads: `${API_URL}/uploads`,
};

