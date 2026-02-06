const createBaseStrategy = require("./base.strategy");

/**
 * @param {Object} [params] - Initialization options.
 * @param {string} [params.apiKey] - API key for authentication.
 * @param {string} [params.accessToken] - Access token for API requests.
 * @param {string} [params.refreshToken] - Refresh token for renewing access.
 */
function createEHStrategy(params = {}) {
  const base = createBaseStrategy(params);
  
  return {
    ...base,
    name: "EH",
    strategyType: "EHStrategy",

    async authenticate() {
      console.log("Authenticating with Employment Hero API");
      return {
        tenantId: "eh-tenant-001",
        userId: "eh-user-123",
        name: "EH User",
      };
    }
  };
}

module.exports = createEHStrategy;
