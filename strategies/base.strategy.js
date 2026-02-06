/**
 * BaseStrategy serves as a foundational factory for implementing various strategies.
 * It manages API credentials and provides a common structure for derived strategy objects.
 *
 * @param {Object} [params] - Initialization options.
 * @param {string} [params.apiKey] - API key for authentication.
 * @param {string} [params.accessToken] - Access token for API requests.
 * @param {string} [params.refreshToken] - Refresh token for renewing access.
 */
function createBaseStrategy(params = {}) {
  return {
    name: "unknown",
    
    // Have to return credentials data
    authenticate() {
      // Implement authentication logic here
      throw new Error('Method "authenticate()" must be implemented.');
    }
  };
}

module.exports = createBaseStrategy;
