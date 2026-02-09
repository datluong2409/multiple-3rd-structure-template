/**
 * Timesheet Service - Application Layer
 * Business logic for timesheet operations
 */
class TimesheetService {
  constructor({ createTimesheetRepository, logger }) {
    this.createTimesheetRepository = createTimesheetRepository;
    this.logger = logger;
  }

  /**
   * Get timesheet by ID from specific provider
   */
  async getTimesheet(provider, id) {
    this.logger.info('Getting timesheet', { provider, id });
    const repository = this.createTimesheetRepository(provider);
    return repository.findById(id);
  }
}

module.exports = TimesheetService;
