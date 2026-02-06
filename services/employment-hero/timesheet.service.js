const createTimeSheetBaseService = require("../base/timesheet-base.service");

function createEHTimeSheetService(strategy) {
  const baseService = createTimeSheetBaseService(strategy);
  const { apiCall } = baseService;

  const service = {
    ...baseService,
    serviceType: "EHTimeSheetService",

    get: apiCall((...params) => (credentialData) => {
      console.log(`Fetching timesheet ${params} from Employment Hero API`);
      console.log(credentialData);
      
      return { id: params[0], employee: 'Jane Smith', hours: 38, status: 'approved' };
    }),

    list: apiCall((...params) => (credentialData) => {
      console.log(`Listing timesheets from Employment Hero API`);
      console.log(credentialData);
      
      return [{ id: 1, employee: 'Jane Smith', hours: 38 }];
    }),

    create: apiCall((...params) => (credentialData) => {
      console.log(`Creating timesheet in Employment Hero API`);
      console.log(credentialData);
      
      return { id: Date.now(), ...params[0], status: 'created' };
    }),

    update: apiCall((...params) => (credentialData) => {
      console.log(`Updating timesheet ${params[0]} in Employment Hero API`);
      console.log(credentialData);
      
      return { id: params[0], ...params[1], status: 'updated' };
    }),

    approve: apiCall((...params) => (credentialData) => {
      console.log(`Approving timesheet ${params[0]} in Employment Hero API`);
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

module.exports = createEHTimeSheetService;
