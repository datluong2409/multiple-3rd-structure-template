const BaseStrategy = require("./base.strategy");
const EHTimeSheetService = require("../services/employment-hero/timesheet.service");

/**
 * @param {Object} [params] - Initialization options.
 * @param {string} [params.apiKey] - API key for authentication.
 * @param {string} [params.accessToken] - Access token for API requests.
 * @param {string} [params.refreshToken] - Refresh token for renewing access.
 */
class EHStrategy extends BaseStrategy {
  name = "EH";

  constructor() {
    super();
  }

  async authenticate() {
    console.log("Authenticating with Employment Hero API");
    return {
      tenantId: "eh-tenant-001",
      userId: "eh-user-123",
      name: "EH User",
    };
  }
}
module.exports = EHStrategy;
