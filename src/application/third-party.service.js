const container = require("../di/container");

/**
 * Third Party Service - Factory for creating service instances
 * @class ThirdPartyService
 */
class ThirdPartyService {

  constructor(dependencies) {
    this.createTimesheetRepository = dependencies.createTimesheetRepository;
    this.logger = dependencies.logger;
  }

  /**
   * Creates and returns a TimesheetService instance from DI container
   * @static
   * @returns {import('./services/timesheet.service')} TimesheetService instance
   */
  static createTimeSheetServiceInstance() {    
    return container.resolve('timesheetService',);
  }
}

module.exports = ThirdPartyService;
