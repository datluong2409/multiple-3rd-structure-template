const IAuthProvider = require('../../../core/interfaces/auth.provider.interface');
const { AuthenticationError } = require('../../../shared/errors');

/**
 * Employment Hero Authentication Provider
 */
class EHAuthProvider extends IAuthProvider {
  constructor(config, logger) {
    super();
    this.config = config;
    this.logger = logger;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async authenticate() {
    try {
      this.logger.info('Authenticating with Employment Hero API');
      
      // Simulate authentication
      // In real implementation, this would call the actual API
      this.accessToken = `eh_token_${Date.now()}`;
      this.tokenExpiry = Date.now() + 3600000; // 1 hour

      const credentials = {
        accessToken: this.accessToken,
        tenantId: 'eh-tenant-001',
        userId: 'eh-user-123',
        name: 'EH User',
        expiresAt: this.tokenExpiry,
      };

      this.logger.info('Successfully authenticated with Employment Hero');
      return credentials;
    } catch (error) {
      this.logger.error('Authentication failed', { provider: 'Employment Hero', error: error.message });
      throw new AuthenticationError('Failed to authenticate with Employment Hero', 'Employment Hero');
    }
  }

  async refreshToken() {
    this.logger.info('Refreshing Employment Hero token');
    return this.authenticate();
  }

  async validateToken(token) {
    return this.accessToken === token && Date.now() < this.tokenExpiry;
  }
}

module.exports = EHAuthProvider;
