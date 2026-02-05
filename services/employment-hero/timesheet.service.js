const TimeSheetBaseService = require("../base/timesheet-base.service");

class EHTimeSheetService extends TimeSheetBaseService {
  constructor(strategy) {
    super(strategy);
  }

  get = this.apiCall((...params) => (credentialData) => {
    console.log(`Fetching timesheet ${params} from Employment Hero API`);
    console.log(credentialData);
    
    return { id: params[0], employee: 'Jane Smith', hours: 38, status: 'approved' };
  });

  list = this.apiCall((...params) => (credentialData) => {
    console.log(`Listing timesheets from Employment Hero API`);
    console.log(credentialData);
    
    return [{ id: 1, employee: 'Jane Smith', hours: 38 }];
  });

  create = this.apiCall((...params) => (credentialData) => {
    console.log(`Creating timesheet in Employment Hero API`);
    console.log(credentialData);
    
    return { id: Date.now(), ...params[0], status: 'created' };
  });

  update = this.apiCall((...params) => (credentialData) => {
    console.log(`Updating timesheet ${params[0]} in Employment Hero API`);
    console.log(credentialData);
    
    return { id: params[0], ...params[1], status: 'updated' };
  });

  approve = this.apiCall((...params) => (credentialData) => {
    console.log(`Approving timesheet ${params[0]} in Employment Hero API`);
    console.log(credentialData);
    
    return { id: params[0], status: 'approved' };
  });
}
module.exports = EHTimeSheetService;
