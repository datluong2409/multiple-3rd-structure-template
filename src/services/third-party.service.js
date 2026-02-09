const container = require("../di/container");
const awilix = require('awilix');

/**
 * Third Party Service - Factory for creating service instances
 * @class ThirdPartyService
 */
class ThirdPartyService {

  constructor(dependencies) {
  }

  /**
   * Creates and returns a TimesheetService instance from DI container
   * @static
   * @param {string} provider - Provider name (e.g., 'employmentHero', 'humanforce', 'myob')
   * @returns {import('./timesheet.service')} TimesheetService instance
   */
  static createTimeSheetServiceInstance(provider) {    
    const scopedContainer = container.createScope();
    scopedContainer.register({
      provider: awilix.asValue(provider)
    });
    return scopedContainer.resolve('timesheetService');
  }
}

module.exports = ThirdPartyService;
