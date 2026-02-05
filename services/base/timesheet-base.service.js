const BaseService = require("./base.service");


class TimeSheetBaseService extends BaseService {
  constructor(strategy) {
    super(strategy);
  }
  
  approve(...params) {
    throw new Error('Method "approve()" must be implemented.');
  }
}
module.exports = TimeSheetBaseService;
