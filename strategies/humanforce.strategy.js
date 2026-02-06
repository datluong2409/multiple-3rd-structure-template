const createBaseStrategy = require("./base.strategy");

function createHumanForceStrategy(params = {}) {
  const base = createBaseStrategy(params);
  
  return {
    ...base,
    name: "HumanForce",
    strategyType: "HumanForceStrategy",

    async authenticate() {
      console.log("Authenticating with HumanForce API");

      return {
        tenantId: "hf-tenant-001",
        userId: "hf-user-123",
        name: "HumanForce User",
      };
    }
  };
}

module.exports = createHumanForceStrategy;
