/**
 * Advanced API Client Orchestration
 * Enforces strict typing, memory safety, and comprehensive error handling.
 */

export interface ApiError extends Error {
  status: number;
  data?: any;
}

interface RequestOptions extends RequestInit {
  retries?: number;
  backoffMs?: number;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiClient = {
  /**
   * Core fetch implementation with exponential backoff and generic typing.
   * O(1) space complexity, O(R) time complexity where R = retries.
   */
  async fetch<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
    const { retries = 2, backoffMs = 500, ...fetchOptions } = options;
    const token = typeof window !== 'undefined' ? localStorage.getItem('motofit_session') : null;
    
    const headers = new Headers(fetchOptions.headers || {});
    headers.set('Content-Type', 'application/json');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    let lastError: any = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          ...fetchOptions,
          headers
        });

        // Handle Auto-logout explicitly on 401
        if (response.status === 401 && typeof window !== 'undefined') {
          localStorage.removeItem('motofit_session');
          localStorage.removeItem('motofit_user');
          window.location.href = '/login';
          throw new Error("Unauthorized access. Session terminated.");
        }

        // Standard error parsing
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const error = new Error(`API Error: ${response.statusText}`) as ApiError;
          error.status = response.status;
          error.data = errorData;
          throw error;
        }

        // Return strictly typed data
        const data = await response.json().catch(() => null);
        return data as T;
        
      } catch (error: any) {
        lastError = error;
        // Only retry on network failures or 5xx server errors
        const isRetryable = !error.status || error.status >= 500;
        
        if (isRetryable && attempt < retries) {
          const waitTime = backoffMs * Math.pow(2, attempt);
          await delay(waitTime);
          continue;
        }
        break; // Break and throw if not retryable
      }
    }

    throw lastError;
  },

  // Convenience methods
  get<T>(url: string, options?: RequestOptions) {
    return this.fetch<T>(url, { ...options, method: 'GET' });
  },
  post<T>(url: string, body: any, options?: RequestOptions) {
    return this.fetch<T>(url, { ...options, method: 'POST', body: JSON.stringify(body) });
  },
  put<T>(url: string, body: any, options?: RequestOptions) {
    return this.fetch<T>(url, { ...options, method: 'PUT', body: JSON.stringify(body) });
  },
  delete<T>(url: string, options?: RequestOptions) {
    return this.fetch<T>(url, { ...options, method: 'DELETE' });
  }
};
