const IAuthProvider = require('../../../core/interfaces/auth.provider.interface');
const { AuthenticationError } = require('../../../shared/errors');

/**
 * MYOB Authentication Provider
 */
class MYOBAuthProvider extends IAuthProvider {
  constructor(config, logger) {
    super();
    this.config = config;
    this.logger = logger;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async authenticate() {
    try {
      this.logger.info('Authenticating with MYOB API');
      
      // Simulate authentication
      this.accessToken = `myob_token_${Date.now()}`;
      this.tokenExpiry = Date.now() + 3600000; // 1 hour

      const credentials = {
        accessToken: this.accessToken,
        tenantId: 'myob-tenant-001',
        userId: 'myob-user-789',
        name: 'MYOB User',
        expiresAt: this.tokenExpiry,
      };

      this.logger.info('Successfully authenticated with MYOB');
      return credentials;
    } catch (error) {
      this.logger.error('Authentication failed', { provider: 'MYOB', error: error.message });
      throw new AuthenticationError('Failed to authenticate with MYOB', 'MYOB');
    }
  }

  async refreshToken() {
    this.logger.info('Refreshing MYOB token');
    return this.authenticate();
  }

  async validateToken(token) {
    return this.accessToken === token && Date.now() < this.tokenExpiry;
  }
}

module.exports = MYOBAuthProvider;
