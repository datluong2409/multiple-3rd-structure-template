const IBaseRepository = require('./base.repository.interface');

/**
 * Timesheet Repository Interface
 * Extends base repository with timesheet-specific methods
 */
class ITimesheetRepository extends IBaseRepository {
  async approve(id) {
    throw new Error('Method "approve()" must be implemented');
  }

  async reject(id, reason) {
    throw new Error('Method "reject()" must be implemented');
  }
}

module.exports = ITimesheetRepository;
