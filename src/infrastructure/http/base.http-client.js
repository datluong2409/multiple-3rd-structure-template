const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const { AuthenticationError } = require('../../shared/errors');
const IAuthProvider = require('../../core/interfaces/auth.provider.interface');

/**
 * Base HTTP Client for all providers
 */
class BaseHttpClient {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.credentials = null;
    
    // Create axios instance
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Configure retry logic
    axiosRetry(this.client, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) 
          || error.response?.status === 429; // Rate limit
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (this.credentials) {
          config.headers['Authorization'] = `Bearer ${this.credentials.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        this.logger.error('HTTP request failed', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          message: error.message,
        });
        return Promise.reject(error);
      }
    );
  }

  setCredentials(credentials) {
    this.credentials = credentials;
  }

  async get(url, params = {}) {
    const response = await this.client.get(url, { params });
    return response.data;
  }

  async post(url, data = {}) {
    const response = await this.client.post(url, data);
    return response.data;
  }

  async put(url, data = {}) {
    const response = await this.client.put(url, data);
    return response.data;
  }

  async patch(url, data = {}) {
    const response = await this.client.patch(url, data);
    return response.data;
  }

  async delete(url) {
    const response = await this.client.delete(url);
    return response.data;
  }
}

module.exports = BaseHttpClient;
