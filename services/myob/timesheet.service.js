const TimeSheetBaseService = require("../base/timesheet-base.service");

class MYOBTimeSheetService extends TimeSheetBaseService {
  constructor(strategy) {
    super(strategy);
  }

  get = this.apiCall((...params) => (credentialData) => {
    console.log(`Fetching timesheet ${params} from MYOB API`);
    console.log(credentialData);
    
    return { id: params[0], employee: 'Bob Wilson', hours: 42, status: 'pending' };
  });

  list = this.apiCall((...params) => (credentialData) => {
    console.log(`Listing timesheets from MYOB API`);
    console.log(credentialData);
    
    return [{ id: 1, employee: 'Bob Wilson', hours: 42 }];
  });

  create = this.apiCall((...params) => (credentialData) => {
    console.log(`Creating timesheet in MYOB API`);
    console.log(credentialData);
    
    return { id: Date.now(), ...params[0], status: 'created' };
  });

  update = this.apiCall((...params) => (credentialData) => {
    console.log(`Updating timesheet ${params[0]} in MYOB API`);
    console.log(credentialData);
    
    return { id: params[0], ...params[1], status: 'updated' };
  });

  approve = this.apiCall((...params) => (credentialData) => {
    console.log(`Approving timesheet ${params[0]} in MYOB API`);
    console.log(credentialData);
    
    return { id: params[0], status: 'approved' };
  });
}
module.exports = MYOBTimeSheetService;
