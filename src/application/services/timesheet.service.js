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

  /**
   * List all timesheets from specific provider
   */
  async listTimesheets(provider, filters = {}) {
    this.logger.info('Listing timesheets', { provider, filters });
    const repository = this.createTimesheetRepository(provider);
    return repository.findAll(filters);
  }

  /**
   * Create timesheet in specific provider
   */
  async createTimesheet(provider, data) {
    this.logger.info('Creating timesheet', { provider });
    const repository = this.createTimesheetRepository(provider);
    return repository.create(data);
  }

  /**
   * Update timesheet in specific provider
   */
  async updateTimesheet(provider, id, data) {
    this.logger.info('Updating timesheet', { provider, id });
    const repository = this.createTimesheetRepository(provider);
    return repository.update(id, data);
  }

  /**
   * Delete timesheet from specific provider
   */
  async deleteTimesheet(provider, id) {
    this.logger.info('Deleting timesheet', { provider, id });
    const repository = this.createTimesheetRepository(provider);
    return repository.delete(id);
  }

  /**
   * Approve timesheet in specific provider
   */
  async approveTimesheet(provider, id) {
    this.logger.info('Approving timesheet', { provider, id });
    const repository = this.createTimesheetRepository(provider);
    return repository.approve(id);
  }

  /**
   * Reject timesheet in specific provider
   */
  async rejectTimesheet(provider, id, reason) {
    this.logger.info('Rejecting timesheet', { provider, id, reason });
    const repository = this.createTimesheetRepository(provider);
    return repository.reject(id, reason);
  }

  /**
   * Get timesheets by employee from specific provider
   */
  async getTimesheetsByEmployee(provider, employeeId, filters = {}) {
    this.logger.info('Getting timesheets by employee', { provider, employeeId });
    const repository = this.createTimesheetRepository(provider);
    return repository.findByEmployee(employeeId, filters);
  }

  /**
   * Get timesheets by date range from specific provider
   */
  async getTimesheetsByDateRange(provider, startDate, endDate) {
    this.logger.info('Getting timesheets by date range', { provider, startDate, endDate });
    const repository = this.createTimesheetRepository(provider);
    return repository.findByDateRange(startDate, endDate);
  }
}

module.exports = TimesheetService;
