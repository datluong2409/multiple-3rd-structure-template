const BaseHttpClient = require('../../http/base.http-client');
const EHAuthProvider = require('./eh.auth-provider');

/**
 * Employment Hero HTTP Client
 */
class EHHttpClient extends BaseHttpClient {
  constructor(config, logger) {
    super(config, logger);
    this.authProvider = new EHAuthProvider(config, logger);
  }

  async ensureAuthenticated() {
    if (!this.credentials) {
      const credentials = await this.authProvider.authenticate();
      this.setCredentials(credentials);
    }
    return this.credentials;
  }

  // Override methods to ensure authentication
  async get(url, params = {}) {
    await this.ensureAuthenticated();
    return super.get(url, params);
  }

  async post(url, data = {}) {
    await this.ensureAuthenticated();
    return super.post(url, data);
  }

  async put(url, data = {}) {
    await this.ensureAuthenticated();
    return super.put(url, data);
  }

  async patch(url, data = {}) {
    await this.ensureAuthenticated();
    return super.patch(url, data);
  }

  async delete(url) {
    await this.ensureAuthenticated();
    return super.delete(url);
  }
}

module.exports = EHHttpClient;
