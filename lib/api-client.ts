export const apiClient = {
  async fetch(url: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('motofit_session') : null;
    
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (response.status === 401) {
      // Auto-logout if unauthorized
      if (typeof window !== 'undefined') {
        localStorage.removeItem('motofit_session');
        localStorage.removeItem('motofit_user');
        window.location.href = '/login';
      }
    }

    return response;
  }
};
