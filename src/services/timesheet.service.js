class TimesheetService {
    /**
   * @type {import('../core/interfaces/timesheet.repository.interface.js')}
   */
  repository = null;

  constructor({ createTimesheetRepository, provider }) {
    this.createTimesheetRepository = createTimesheetRepository;
    this.provider = provider; // Optional default provider
    
    this.repository = this.createTimesheetRepository(provider);
  }

  /**
   * Get timesheet by ID
   * @param {string|number} id - Timesheet ID
   */
  async getById(id) {
    return this.repository.findById(id);
  }
}

module.exports = TimesheetService;
