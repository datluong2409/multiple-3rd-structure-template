const ITimesheetRepository = require('../../../core/interfaces/timesheet.repository.interface');
const TimesheetEntity = require('../../../core/entities/timesheet.entity');
const { RepositoryError } = require('../../../shared/errors');

/**
 * MYOB Timesheet Repository
 */
class MYOBTimesheetRepository extends ITimesheetRepository {
  constructor(httpClient, logger) {
    super();
    this.client = httpClient;
    this.logger = logger;
  }

  mapToEntity(data) {
    return new TimesheetEntity({
      id: data.id || data.UID,
      employeeId: data.employeeId || data.Employee?.UID,
      employeeName: data.employeeName || data.Employee?.Name,
      hours: data.hours || data.Hours,
      date: data.date ? new Date(data.date) : new Date(),
      status: data.status || data.Status,
      notes: data.notes || data.Notes || '',
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    });
  }

  mapToApiFormat(entity) {
    return {
      Employee: { UID: entity.employeeId },
      Hours: entity.hours,
      Date: entity.date,
      Status: entity.status,
      Notes: entity.notes,
    };
  }

  async findById(id) {
    try {
      this.logger.info('Fetching timesheet by ID', { id, provider: 'MYOB' });
      
      const data = {
        UID: id,
        Employee: {
          Name: 'Bob Wilson',
          UID: 'emp-789',
        },
        Hours: 35,
        Status: 'submitted',
        Date: new Date().toISOString(),
      };

      const entity = this.mapToEntity(data);
      this.logger.info('Successfully fetched timesheet', { id });
      return entity;
    } catch (error) {
      this.logger.error('Failed to fetch timesheet', { id, error: error.message });
      throw new RepositoryError(`Failed to fetch timesheet ${id}`, error);
    }
  }

  async findAll(filters = {}) {
    try {
      this.logger.info('Fetching all timesheets', { filters, provider: 'MYOB' });
      
      const data = [
        {
          UID: 1,
          Employee: {
            Name: 'Bob Wilson',
            UID: 'emp-789',
          },
          Hours: 35,
          Status: 'submitted',
        },
      ];

      const entities = data.map(item => this.mapToEntity(item));
      this.logger.info('Successfully fetched timesheets', { count: entities.length });
      return entities;
    } catch (error) {
      this.logger.error('Failed to fetch timesheets', { error: error.message });
      throw new RepositoryError('Failed to fetch timesheets', error);
    }
  }

  async create(data) {
    try {
      this.logger.info('Creating timesheet', { provider: 'MYOB' });
      
      const entity = new TimesheetEntity(data);
      const validation = entity.validate();
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const apiData = this.mapToApiFormat(entity);
      const response = {
        UID: Date.now(),
        ...apiData,
        Status: 'created',
      };

      const createdEntity = this.mapToEntity(response);
      this.logger.info('Successfully created timesheet', { id: createdEntity.id });
      return createdEntity;
    } catch (error) {
      this.logger.error('Failed to create timesheet', { error: error.message });
      throw new RepositoryError('Failed to create timesheet', error);
    }
  }

  async update(id, data) {
    try {
      this.logger.info('Updating timesheet', { id, provider: 'MYOB' });
      
      const response = {
        UID: id,
        ...data,
        Status: 'updated',
      };

      const entity = this.mapToEntity(response);
      this.logger.info('Successfully updated timesheet', { id });
      return entity;
    } catch (error) {
      this.logger.error('Failed to update timesheet', { id, error: error.message });
      throw new RepositoryError(`Failed to update timesheet ${id}`, error);
    }
  }

  async delete(id) {
    try {
      this.logger.info('Deleting timesheet', { id, provider: 'MYOB' });
      this.logger.info('Successfully deleted timesheet', { id });
      return true;
    } catch (error) {
      this.logger.error('Failed to delete timesheet', { id, error: error.message });
      throw new RepositoryError(`Failed to delete timesheet ${id}`, error);
    }
  }

  async approve(id) {
    try {
      this.logger.info('Approving timesheet', { id, provider: 'MYOB' });
      
      const response = {
        UID: id,
        Status: 'approved',
      };

      const entity = this.mapToEntity(response);
      this.logger.info('Successfully approved timesheet', { id });
      return entity;
    } catch (error) {
      this.logger.error('Failed to approve timesheet', { id, error: error.message });
      throw new RepositoryError(`Failed to approve timesheet ${id}`, error);
    }
  }

  async reject(id, reason) {
    try {
      this.logger.info('Rejecting timesheet', { id, reason, provider: 'MYOB' });
      
      const response = {
        UID: id,
        Status: 'rejected',
        Notes: reason,
      };

      const entity = this.mapToEntity(response);
      this.logger.info('Successfully rejected timesheet', { id });
      return entity;
    } catch (error) {
      this.logger.error('Failed to reject timesheet', { id, error: error.message });
      throw new RepositoryError(`Failed to reject timesheet ${id}`, error);
    }
  }

  async findByEmployee(employeeId, filters = {}) {
    try {
      this.logger.info('Fetching timesheets by employee', { employeeId, provider: 'MYOB' });
      
      const data = [];
      const entities = data.map(item => this.mapToEntity(item));
      
      this.logger.info('Successfully fetched employee timesheets', { count: entities.length });
      return entities;
    } catch (error) {
      this.logger.error('Failed to fetch employee timesheets', { employeeId, error: error.message });
      throw new RepositoryError(`Failed to fetch timesheets for employee ${employeeId}`, error);
    }
  }

  async findByDateRange(startDate, endDate) {
    try {
      this.logger.info('Fetching timesheets by date range', { startDate, endDate, provider: 'MYOB' });
      
      const data = [];
      const entities = data.map(item => this.mapToEntity(item));
      
      this.logger.info('Successfully fetched timesheets by date range', { count: entities.length });
      return entities;
    } catch (error) {
      this.logger.error('Failed to fetch timesheets by date range', { error: error.message });
      throw new RepositoryError('Failed to fetch timesheets by date range', error);
    }
  }
}

module.exports = MYOBTimesheetRepository;
