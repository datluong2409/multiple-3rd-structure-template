const BaseHttpClient = require('../../http/base.http-client');
const HumanForceAuthProvider = require('./humanforce.auth-provider');

/**
 * HumanForce HTTP Client
 */
class HumanForceHttpClient extends BaseHttpClient {
  constructor(config, logger) {
    super(config, logger);
    this.authProvider = new HumanForceAuthProvider(config, logger);
  }

  async ensureAuthenticated() {
    if (!this.credentials) {
      const credentials = await this.authProvider.authenticate();
      this.setCredentials(credentials);
    }
    return this.credentials;
  }

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

module.exports = HumanForceHttpClient;
