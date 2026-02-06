const createTimeSheetBaseService = require("../base/timesheet-base.service");

function createHumanForceTimeSheetService(strategy) {
  const baseService = createTimeSheetBaseService(strategy);
  const { apiCall } = baseService;

  const service = {
    ...baseService,
    serviceType: "HumanForceTimeSheetService",

    get: apiCall((id) => (credentialData) => {
      console.log(`Fetching timesheet ${id} from HumanForce API`);
      console.log(credentialData);
      
      return { id: id, employee: 'John Doe', hours: 40, status: 'pending' };
    }),

    list: apiCall((...params) => (credentialData) => {
      console.log(`Listing timesheets from HumanForce API`);
      console.log(credentialData);
      
      return [{ id: 1, employee: 'John Doe', hours: 40 }, { id: 2, employee: 'Alice Brown', hours: 35 }];
    }),

    create: apiCall((...params) => (credentialData) => {
      console.log(`Creating timesheet in HumanForce API`);
      console.log(credentialData);
      
      return { id: Date.now(), ...params[0], status: 'created' };
    }),

    update: apiCall((...params) => (credentialData) => {
      console.log(`Updating timesheet ${params[0]} in HumanForce API`);
      console.log(credentialData);
      
      return { id: params[0], ...params[1], status: 'updated' };
    }),

    approve: apiCall((...params) => (credentialData) => {
      console.log(`Approving timesheet ${params[0]} in HumanForce API`);
      console.log(credentialData);
      
      return { id: params[0], status: 'approved' };
    })
  };

  return new Proxy(service, {
    get(target, prop) {
      return target[prop];
    }
  });
}

module.exports = createHumanForceTimeSheetService;
