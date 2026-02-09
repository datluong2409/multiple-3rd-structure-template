const IAuthProvider = require('../../../core/interfaces/auth.provider.interface');
const { AuthenticationError } = require('../../../shared/errors');

/**
 * HumanForce Authentication Provider
 */
class HumanForceAuthProvider extends IAuthProvider {
  constructor(config, logger) {
    super();
    this.config = config;
    this.logger = logger;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async authenticate() {
    try {
      this.logger.info('Authenticating with HumanForce API');
      
      // Simulate authentication
      this.accessToken = `hf_token_${Date.now()}`;
      this.tokenExpiry = Date.now() + 3600000; // 1 hour

      const credentials = {
        accessToken: this.accessToken,
        tenantId: 'hf-tenant-001',
        userId: 'hf-user-456',
        name: 'HumanForce User',
        expiresAt: this.tokenExpiry,
      };

      this.logger.info('Successfully authenticated with HumanForce');
      return credentials;
    } catch (error) {
      this.logger.error('Authentication failed', { provider: 'HumanForce', error: error.message });
      throw new AuthenticationError('Failed to authenticate with HumanForce', 'HumanForce');
    }
  }

  async refreshToken() {
    this.logger.info('Refreshing HumanForce token');
    return this.authenticate();
  }

  async validateToken(token) {
    return this.accessToken === token && Date.now() < this.tokenExpiry;
  }
}

module.exports = HumanForceAuthProvider;
