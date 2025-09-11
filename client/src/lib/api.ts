const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      let response = await fetch(url, config);
      if (response.status === 401 || response.status === 403) {
        // try refresh
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const r = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken })
            });
            const tokens = await r.json();
            if (r.ok && tokens?.accessToken) {
              localStorage.setItem('accessToken', tokens.accessToken);
              if (tokens.refreshToken) localStorage.setItem('refreshToken', tokens.refreshToken);
              // retry original
              response = await fetch(url, {
                ...config,
                headers: { ...config.headers as any, Authorization: `Bearer ${tokens.accessToken}` }
              });
            }
          } catch {}
        }
      }
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async register(userData: { fullName: string; email: string; password: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  // Trip methods
  async getTrips() {
    return this.request('/trips');
  }

  async createTrip(tripData: {
    destination: string;
    startDate: string;
    endDate: string;
    notes?: string;
  }) {
    return this.request('/trips', {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
  }

  async updateTrip(tripId: string, tripData: {
    destination?: string;
    startDate?: string;
    endDate?: string;
    notes?: string;
  }) {
    return this.request(`/trips/${tripId}`, {
      method: 'PUT',
      body: JSON.stringify(tripData),
    });
  }

  async deleteTrip(tripId: string) {
    return this.request(`/trips/${tripId}`, { method: 'DELETE' });
  }

  // Integrations
  async geocode(query: string) {
    return this.request(`/integrations/geocode?q=${encodeURIComponent(query)}`);
  }

  async weather(lat: number, lon: number) {
    return this.request(`/integrations/weather?lat=${lat}&lon=${lon}`);
  }

  async autocomplete(query: string) {
    return this.request(`/integrations/autocomplete?q=${encodeURIComponent(query)}`);
  }

  async suggestDestinations(params: { budget?: 'low'|'medium'|'high'; tripType?: 'adventure'|'leisure'|'culture'; origin?: string; month?: string; }) {
    return this.request(`/suggestions`, {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }
}

export const api = new ApiClient();