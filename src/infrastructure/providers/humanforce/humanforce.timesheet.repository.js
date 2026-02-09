const ITimesheetRepository = require('../../../core/interfaces/timesheet.repository.interface');
const TimesheetEntity = require('../../../core/entities/timesheet.entity');
const { RepositoryError } = require('../../../shared/errors');

/**
 * HumanForce Timesheet Repository
 */
class HumanForceTimesheetRepository extends ITimesheetRepository {
  constructor(httpClient) {
    super();
    this.client = httpClient;
  }

  mapToEntity(data) {
    return new TimesheetEntity({
      id: data.id,
      employeeId: data.employeeId || data.employee_id,
      employeeName: data.employeeName || data.employee_name,
      hours: data.hours || data.worked_hours,
      date: data.date ? new Date(data.date) : new Date(),
      status: data.status,
      notes: data.notes || '',
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    });
  }

  mapToApiFormat(entity) {
    return {
      employeeId: entity.employeeId,
      worked_hours: entity.hours,
      date: entity.date,
      status: entity.status,
      notes: entity.notes,
    };
  }

  async findById(id) {
    try {
      
      const data = {
        id,
        employeeName: 'John Doe',
        employeeId: 'emp-456',
        hours: 40,
        status: 'pending',
        date: new Date().toISOString(),
      };

      const entity = this.mapToEntity(data);
      return entity;
    } catch (error) {
      throw new RepositoryError(`Failed to fetch timesheet ${id}`, error);
    }
  }

  async findAll(filters = {}) {
    try {
      
      const data = [
        {
          id: 1,
          employeeName: 'John Doe',
          employeeId: 'emp-456',
          hours: 40,
          status: 'pending',
        },
      ];

      const entities = data.map(item => this.mapToEntity(item));
      return entities;
    } catch (error) {
      throw new RepositoryError('Failed to fetch timesheets', error);
    }
  }

  async create(data) {
    try {
      
      const entity = new TimesheetEntity(data);
      const validation = entity.validate();
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const apiData = this.mapToApiFormat(entity);
      const response = {
        id: Date.now(),
        ...apiData,
        status: 'created',
      };

      const createdEntity = this.mapToEntity(response);
      return createdEntity;
    } catch (error) {
      throw new RepositoryError('Failed to create timesheet', error);
    }
  }

  async update(id, data) {
    try {
      
      const response = {
        id,
        ...data,
        status: 'updated',
      };

      const entity = this.mapToEntity(response);
      return entity;
    } catch (error) {
      throw new RepositoryError(`Failed to update timesheet ${id}`, error);
    }
  }

  async delete(id) {
    try {
      return true;
    } catch (error) {
      throw new RepositoryError(`Failed to delete timesheet ${id}`, error);
    }
  }

  async approve(id) {
    try {
      
      const response = {
        id,
        status: 'approved',
      };

      const entity = this.mapToEntity(response);
      return entity;
    } catch (error) {
      throw new RepositoryError(`Failed to approve timesheet ${id}`, error);
    }
  }

  async reject(id, reason) {
    try {
      
      const response = {
        id,
        status: 'rejected',
        notes: reason,
      };

      const entity = this.mapToEntity(response);
      return entity;
    } catch (error) {
      throw new RepositoryError(`Failed to reject timesheet ${id}`, error);
    }
  }

  async findByEmployee(employeeId, filters = {}) {
    try {
      
      const data = [];
      const entities = data.map(item => this.mapToEntity(item));
      return entities;
    } catch (error) {
      throw new RepositoryError(`Failed to fetch timesheets for employee ${employeeId}`, error);
    }
  }

  async findByDateRange(startDate, endDate) {
    try {
      
      const data = [];
      const entities = data.map(item => this.mapToEntity(item));
      
      return entities;
    } catch (error) {
      throw new RepositoryError('Failed to fetch timesheets by date range', error);
    }
  }
}

module.exports = HumanForceTimesheetRepository;
