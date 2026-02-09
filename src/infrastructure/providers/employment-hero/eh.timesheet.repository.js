const ITimesheetRepository = require('../../../core/interfaces/timesheet.repository.interface');
const TimesheetEntity = require('../../../core/entities/timesheet.entity');
const { RepositoryError } = require('../../../shared/errors');

/**
 * Employment Hero Timesheet Repository
 */
class EHTimesheetRepository extends ITimesheetRepository {
  constructor(httpClient, logger) {
    super();
    this.client = httpClient;
    this.logger = logger;
  }

  /**
   * Map API response to TimesheetEntity
   */
  mapToEntity(data) {
    return new TimesheetEntity({
      id: data.id,
      employeeId: data.employee_id || data.employeeId,
      employeeName: data.employee || data.employee_name,
      hours: data.hours || data.total_hours,
      date: data.date ? new Date(data.date) : new Date(),
      status: data.status,
      notes: data.notes || data.comments || '',
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
      updatedAt: data.updated_at ? new Date(data.updated_at) : new Date(),
    });
  }

  /**
   * Map entity to API request format
   */
  mapToApiFormat(entity) {
    return {
      employee_id: entity.employeeId,
      hours: entity.hours,
      date: entity.date,
      status: entity.status,
      comments: entity.notes,
    };
  }

  async findById(id) {
    try {
      this.logger.info('Fetching timesheet by ID', { id, provider: 'Employment Hero' });
      
      // Simulate API call
      const data = {
        id,
        employee: 'Jane Smith',
        employee_id: 'emp-123',
        hours: 38,
        status: 'approved',
        date: new Date().toISOString(),
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
      this.logger.info('Fetching all timesheets', { filters, provider: 'Employment Hero' });
      
      // Simulate API call
      const data = [
        {
          id: 1,
          employee: 'Jane Smith',
          employee_id: 'emp-123',
          hours: 38,
          status: 'approved',
        },
        {
          id: 2,
          employee: 'John Doe',
          employee_id: 'emp-124',
          hours: 40,
          status: 'pending',
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
      this.logger.info('Creating timesheet', { provider: 'Employment Hero' });
      
      const entity = new TimesheetEntity(data);
      const validation = entity.validate();
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Simulate API call
      const apiData = this.mapToApiFormat(entity);
      const response = {
        id: Date.now(),
        ...apiData,
        status: 'created',
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
      this.logger.info('Updating timesheet', { id, provider: 'Employment Hero' });
      
      // Simulate API call
      const response = {
        id,
        ...data,
        status: 'updated',
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
      this.logger.info('Deleting timesheet', { id, provider: 'Employment Hero' });
      
      // Simulate API call
      this.logger.info('Successfully deleted timesheet', { id });
      return true;
    } catch (error) {
      this.logger.error('Failed to delete timesheet', { id, error: error.message });
      throw new RepositoryError(`Failed to delete timesheet ${id}`, error);
    }
  }

  async approve(id) {
    try {
      this.logger.info('Approving timesheet', { id, provider: 'Employment Hero' });
      
      // Simulate API call
      const response = {
        id,
        status: 'approved',
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
      this.logger.info('Rejecting timesheet', { id, reason, provider: 'Employment Hero' });
      
      // Simulate API call
      const response = {
        id,
        status: 'rejected',
        notes: reason,
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
      this.logger.info('Fetching timesheets by employee', { employeeId, provider: 'Employment Hero' });
      
      // Simulate API call
      const data = [
        {
          id: 1,
          employee: 'Jane Smith',
          employee_id: employeeId,
          hours: 38,
          status: 'approved',
        },
      ];

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
      this.logger.info('Fetching timesheets by date range', { startDate, endDate, provider: 'Employment Hero' });
      
      // Simulate API call
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

module.exports = EHTimesheetRepository;
