const createTimeSheetBaseService = require("../base/timesheet-base.service");

function createMYOBTimeSheetService(strategy) {
  const baseService = createTimeSheetBaseService(strategy);
  const { apiCall } = baseService;

  const service = {
    ...baseService,
    serviceType: "MYOBTimeSheetService",

    get: apiCall((...params) => (credentialData) => {
      console.log(`Fetching timesheet ${params} from MYOB API`);
      console.log(credentialData);
      
      return { id: params[0], employee: 'Bob Wilson', hours: 42, status: 'pending' };
    }),

    list: apiCall((...params) => (credentialData) => {
      console.log(`Listing timesheets from MYOB API`);
      console.log(credentialData);
      
      return [{ id: 1, employee: 'Bob Wilson', hours: 42 }];
    }),

    create: apiCall((...params) => (credentialData) => {
      console.log(`Creating timesheet in MYOB API`);
      console.log(credentialData);
      
      return { id: Date.now(), ...params[0], status: 'created' };
    }),

    update: apiCall((...params) => (credentialData) => {
      console.log(`Updating timesheet ${params[0]} in MYOB API`);
      console.log(credentialData);
      
      return { id: params[0], ...params[1], status: 'updated' };
    }),

    approve: apiCall((...params) => (credentialData) => {
      console.log(`Approving timesheet ${params[0]} in MYOB API`);
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

module.exports = createMYOBTimeSheetService;
