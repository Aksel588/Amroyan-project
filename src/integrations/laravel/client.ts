// Laravel API Client
const LARAVEL_API_URL = import.meta.env.VITE_LARAVEL_API_URL || 'http://localhost:8000/api';

class LaravelApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('laravel_token');
  }

  // Method to update token (useful for refreshing)
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('laravel_token', token);
    } else {
      localStorage.removeItem('laravel_token');
    }
  }

  // Method to get current token
  getToken(): string | null {
    return this.token;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Accept': 'application/json',
      ...options.headers,
    };

    // Only set Content-Type to application/json if it's not already set and body is not FormData
    if ((!options.headers || !('Content-Type' in options.headers)) && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Handle 401 Unauthorized - clear invalid token
        if (response.status === 401) {
          this.setToken(null);
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async register(email: string, password: string, password_confirmation: string) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, password_confirmation }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async logout() {
    await this.request('/auth/logout', {
      method: 'POST',
    });
    
    this.setToken(null);
  }

  async getCurrentUser() {
    return await this.request('/auth/user');
  }

  // Blog methods
  async getBlogPosts(params?: {
    published?: boolean;
    category?: string;
    featured?: boolean;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    per_page?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return await this.request(`/blog-posts?${queryParams.toString()}`);
  }

  async getBlogPost(id: string) {
    return await this.request(`/blog-posts/${id}`);
  }

  async createBlogPost(data: any) {
    return await this.request('/blog-posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBlogPost(id: string, data: any) {
    return await this.request(`/blog-posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBlogPost(id: string) {
    return await this.request(`/blog-posts/${id}`, {
      method: 'DELETE',
    });
  }

  // Calculator methods
  async getCalculators(params?: {
    visible?: boolean;
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return await this.request(`/calculators?${queryParams.toString()}`);
  }

  async getCalculator(id: string) {
    return await this.request(`/calculators/${id}`);
  }

  async getCalculatorRates(id: string) {
    return await this.request(`/calculators/${id}/rates`);
  }

  async createCalculatorRate(data: any) {
    return await this.request('/calculator-rates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCalculatorRate(id: string, data: any) {
    return await this.request(`/calculator-rates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCalculatorRate(id: string) {
    return await this.request(`/calculator-rates/${id}`, {
      method: 'DELETE',
    });
  }

  async createCalculator(data: any) {
    return await this.request('/calculators', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCalculator(id: string, data: any) {
    return await this.request(`/calculators/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCalculator(id: string) {
    return await this.request(`/calculators/${id}`, {
      method: 'DELETE',
    });
  }

  // Contact methods
  async getContactMessages(params?: {
    is_read?: boolean;
    search?: string;
    per_page?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return await this.request(`/contact?${queryParams.toString()}`);
  }

  async getContactMessage(id: string) {
    return await this.request(`/contact/${id}`);
  }

  async createContactMessage(data: any) {
    return await this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateContactMessage(id: string, data: any) {
    return await this.request(`/contact/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteContactMessage(id: string) {
    return await this.request(`/contact/${id}`, {
      method: 'DELETE',
    });
  }

  // Document methods
  async getDocuments(params?: {
    category?: string;
    is_published?: boolean;
    published?: boolean; // For backward compatibility
    search?: string;
    per_page?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          // Handle both published and is_published for compatibility
          if (key === 'published') {
            queryParams.append('is_published', value.toString());
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }
    
    return await this.request(`/documents?${queryParams.toString()}`);
  }

  async getDocument(id: string) {
    return await this.request(`/documents/${id}`);
  }

  async createDocument(data: any) {
    return await this.request('/documents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDocument(id: string, data: any) {
    return await this.request(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDocument(id: string) {
    return await this.request(`/documents/${id}`, {
      method: 'DELETE',
    });
  }

  async incrementDocumentView(id: string) {
    return await this.request(`/documents/${id}/increment-view`, {
      method: 'POST',
    });
  }

  // User methods
  async getUsers(params?: {
    search?: string;
    per_page?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return await this.request(`/users?${queryParams.toString()}`);
  }

  async getUser(id: string) {
    return await this.request(`/users/${id}`);
  }

  async updateUser(id: string, data: { role?: string; email?: string; }) {
    return await this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getUsersCount() {
    return await this.request('/users-count');
  }

  // Course Application methods
  async getCourseApplications(params?: {
    status?: string;
    search?: string;
    per_page?: number;
    page?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return await this.request(`/course-applications?${queryParams.toString()}`);
  }

  async getCourseApplication(id: string) {
    return await this.request(`/course-applications/${id}`);
  }

  async createCourseApplication(data: any) {
    return await this.request('/course-applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCourseApplication(id: string, data: any) {
    return await this.request(`/course-applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateCourseApplicationStatus(id: string, data: { status: string; notes?: string }) {
    return await this.request(`/course-applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteCourseApplication(id: string) {
    return await this.request(`/course-applications/${id}`, {
      method: 'DELETE',
    });
  }

  async getCourseApplicationsCount() {
    return await this.request('/course-applications-count');
  }

  async getCourseApplicationsStats() {
    return await this.request('/course-applications-stats');
  }

  // Stats methods
  async getStats() {
    return await this.request('/stats');
  }

  // Image upload method
  async uploadImage(file: File, folder: string = 'blog-images') {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    
    return await this.request('/upload-image', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let the browser set it
      },
    });
  }

  // Document upload method
  async uploadDocument(file: File, data: {
    title: string;
    description: string;
    category: string;
  }) {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);

    return await this.request('/upload-document', {
      method: 'POST',
      body: formData,
    });
  }



  async incrementDocumentViewCount(id: string) {
    return await this.request(`/documents/${id}/increment-view`, {
      method: 'POST',
    });
  }

  async toggleDocumentPublishStatus(id: string) {
    return await this.request(`/documents/${id}/toggle-publish`, {
      method: 'POST',
    });
  }

  // Settings methods
  async getSettings() {
    return await this.request('/settings');
  }

  async updateSettings(settings: any) {
    return await this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async getSetting(key: string) {
    return await this.request(`/settings/${key}`);
  }

  async initializeDefaultSettings() {
    return await this.request('/settings/initialize', {
      method: 'POST',
    });
  }

  // Newsletter methods
  async subscribeToNewsletter(email: string) {
    return await this.request('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async unsubscribeFromNewsletter(email: string) {
    return await this.request('/newsletter/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getNewsletterStats() {
    return await this.request('/newsletter/stats');
  }

  async getNewsletterSubscribers(params?: {
    status?: 'active' | 'inactive' | 'all';
    per_page?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return await this.request(`/newsletter/subscribers?${queryParams.toString()}`);
  }
}

export const laravelApi = new LaravelApiClient(LARAVEL_API_URL); 