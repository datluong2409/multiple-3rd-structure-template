/**
 * BaseStrategy serves as a foundational class for implementing various strategies.
 * It manages API credentials and provides a common structure for derived strategy classes.

 *
 * @param {Object} [params] - Initialization options.
 * @param {string} [params.apiKey] - API key for authentication.
 * @param {string} [params.accessToken] - Access token for API requests.
 * @param {string} [params.refreshToken] - Refresh token for renewing access.
 */
class BaseStrategy {
  name = "unknown";

  constructor() {}

  // Have to return credentials data
  authenticate() {
    // Implement authentication logic here using this.credentials
    throw new Error('Method "authenticate()" must be implemented.');
  }
}
module.exports = BaseStrategy;
