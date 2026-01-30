// API Configuration - في التطوير يستخدم البروكسي (روابط نسبية)، في الإنتاج يستخدم VITE_API_URL
const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'http://localhost:3001');
export const API_URL = API_BASE || 'http://localhost:3001';

export const API_ENDPOINTS = {
  projects: API_BASE ? `${API_BASE}/api/projects` : '/api/projects',
  uploads: API_BASE ? `${API_BASE}/uploads` : '/uploads',
};

