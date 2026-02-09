/**
 * Timesheet Entity - Domain model
 */
class TimesheetEntity {
  constructor(data = {}) {
    this.id = data.id || null;
    this.employeeId = data.employeeId || null;
    this.employeeName = data.employeeName || null;
    this.hours = data.hours || 0;
    this.date = data.date || new Date();
    this.status = data.status || 'pending';
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  /**
   * Validate timesheet data
   */
  validate() {
    const errors = [];
    
    if (!this.employeeId) {
      errors.push('Employee ID is required');
    }
    
    if (this.hours < 0) {
      errors.push('Hours must be positive');
    }
    
    if (this.hours > 24) {
      errors.push('Hours cannot exceed 24');
    }
    
    const validStatuses = ['pending', 'approved', 'rejected', 'submitted'];
    if (!validStatuses.includes(this.status)) {
      errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      id: this.id,
      employeeId: this.employeeId,
      employeeName: this.employeeName,
      hours: this.hours,
      date: this.date,
      status: this.status,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = TimesheetEntity;
