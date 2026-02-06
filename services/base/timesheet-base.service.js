const createBaseService = require("./base.service");

function createTimeSheetBaseService(strategy) {
  const baseService = createBaseService(strategy);
  
  const timesheetService = {
    ...baseService,
    
    approve(...params) {
      throw new Error('Method "approve()" must be implemented.');
    }
  };

  // Return proxy for potential method interception
  return new Proxy(timesheetService, {
    get(target, prop) {
      return target[prop];
    }
  });
}

module.exports = createTimeSheetBaseService;
