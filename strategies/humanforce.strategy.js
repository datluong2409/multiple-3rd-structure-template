const BaseStrategy = require("./base.strategy");
const HumanForceTimeSheetService = require("../services/humanforce/timesheet.service");

class HumanForceStrategy extends BaseStrategy {
  name = "HumanForce";

  constructor() {
    super();
  }

  async authenticate() {
    console.log("Authenticating with HumanForce API");

    return {
      tenantId: "hf-tenant-001",
      userId: "hf-user-123",
      name: "HumanForce User",
    };
  }
}
module.exports = HumanForceStrategy;
