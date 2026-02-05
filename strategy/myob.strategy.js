const BaseStrategy = require("./base.strategy");
const MYOBTimeSheetService = require("../services/myob/timesheet.service");

/**
 * @param {Object} [params] - Initialization options.
 * @param {string} [params.apiKey] - API key for authentication.
 * @param {string} [params.accessToken] - Access token for API requests.
 * @param {string} [params.refreshToken] - Refresh token for renewing access.
 */
class MYOBStrategy extends BaseStrategy {
  name = "MYOB";

  constructor() {
    super();
  }

  async authenticate() {
    console.log("Authenticating with MYOB API");
    return {
      tenantId: "myob-tenant-001",
      userId: "myob-user-123",
      name: "MYOB User",
    };
  }
}
module.exports = MYOBStrategy;
