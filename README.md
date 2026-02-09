# Multiple 3rd-Party Integration Template

Extensible architecture for integrating multiple providers with Repository Pattern and Dependency Injection.

## 🏗️ Architecture

```
src/
├── core/              # Domain layer
│   ├── entities/      # Business entities
│   └── interfaces/    # Repository interfaces
├── infrastructure/    # Implementation layer
│   └── providers/     # Provider implementations
├── services/          # Application services
├── di/               # Dependency injection container
└── config/           # Configuration management
```

## 🚀 How to Add a New Provider

### Step 1: Add provider configuration

**File:** [src/config/index.js](src/config/index.js)

```javascript
providers: Joi.object({
  newProvider: Joi.object({
    name: Joi.string().default('New Provider'),
    apiKey: Joi.string().required(),
    baseUrl: Joi.string().uri().required(),
    timeout: Joi.number().default(30000),
  }).optional(),
  // ... existing providers
})
```

### Step 2: Create HTTP Client

**File:** `src/infrastructure/providers/newprovider/newprovider.http-client.js`

```javascript
const BaseHttpClient = require('../../http/base.http-client');

class NewProviderHttpClient extends BaseHttpClient {
  constructor(config) {
    super({
      baseURL: config.baseUrl,
      timeout: config.timeout,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // Override for custom behavior
  handleError(error) {
    // Custom error handling for this provider
    return super.handleError(error);
  }
}

module.exports = NewProviderHttpClient;
```

### Step 3: Implement Repository

**File:** `src/infrastructure/providers/newprovider/newprovider.timesheet.repository.js`

```javascript
const ITimesheetRepository = require('../../../core/interfaces/timesheet.repository.interface');
const TimesheetEntity = require('../../../core/entities/timesheet.entity');
const { RepositoryError } = require('../../../shared/errors');

class NewProviderTimesheetRepository extends ITimesheetRepository {
  constructor(httpClient) {
    super();
    this.client = httpClient;
  }

  // Map data from API to Entity
  mapToEntity(data) {
    return new TimesheetEntity({
      id: data.id,
      employeeId: data.emp_id,
      employeeName: data.emp_name,
      hours: data.work_hours,
      date: new Date(data.date),
      status: data.status,
      notes: data.comment || '',
    });
  }

  // Map Entity to API format
  mapToApiFormat(entity) {
    return {
      emp_id: entity.employeeId,
      work_hours: entity.hours,
      date: entity.date,
      status: entity.status,
      comment: entity.notes,
    };
  }

  async findById(id) {
    try {
      const response = await this.client.get(`/timesheets/${id}`);
      return this.mapToEntity(response.data);
    } catch (error) {
      throw new RepositoryError(`Failed to fetch timesheet ${id}`, error);
    }
  }

  async findAll(filters = {}) {
    try {
      const response = await this.client.get('/timesheets', { params: filters });
      return response.data.map(item => this.mapToEntity(item));
    } catch (error) {
      throw new RepositoryError('Failed to fetch timesheets', error);
    }
  }

  // Implement other methods: create, update, delete, approve, reject
}

module.exports = NewProviderTimesheetRepository;
```

### Step 4: Register in DI Container

**File:** [src/di/container.js](src/di/container.js)

```javascript
const NewProviderHttpClient = require('../infrastructure/providers/newprovider/newprovider.http-client');
const NewProviderTimesheetRepository = require('../infrastructure/providers/newprovider/newprovider.timesheet.repository');

// Add to createHttpClient factory
container.register({
  createHttpClient: awilix.asFunction(({ config }) => {
    return (providerName) => {
      const providerConfig = config.providers[providerName];
      
      switch (providerName) {
        case 'newprovider':
          return new NewProviderHttpClient(providerConfig);
        // ... existing cases
      }
    };
  }).singleton(),
});

// Add to createTimesheetRepository factory
container.register({
  createTimesheetRepository: awilix.asFunction(({ createHttpClient }) => {
    return (providerName) => {
      const httpClient = createHttpClient(providerName);
      
      switch (providerName) {
        case 'newprovider':
          return new NewProviderTimesheetRepository(httpClient);
        // ... existing cases
      }
    };
  }).singleton(),
});
```

### Step 5: Usage

**File:** [index.js](index.js)

```javascript
async function demoNewProvider() {
  const service = ThirdPartyService.createTimeSheetServiceInstance('newprovider');
  
  // Get timesheet
  const timesheet = await service.getById(123);
  console.log(timesheet);
}

// Or inject directly
const container = require('./src/di/container');
const service = container.resolve('timesheetService');
service.switchProvider('newprovider');
```

## 🎯 How to Add a New Feature (Example: Leave Management)

### Step 1: Create Entity

**File:** `src/core/entities/leave.entity.js`

```javascript
class LeaveEntity {
  constructor(data = {}) {
    this.id = data.id || null;
    this.employeeId = data.employeeId || null;
    this.startDate = data.startDate || null;
    this.endDate = data.endDate || null;
    this.type = data.type || 'annual'; // annual, sick, unpaid
    this.status = data.status || 'pending';
    this.reason = data.reason || '';
  }

  validate() {
    const errors = [];
    
    if (!this.employeeId) errors.push('Employee ID required');
    if (!this.startDate || !this.endDate) errors.push('Dates required');
    if (this.startDate > this.endDate) errors.push('Invalid date range');
    
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = LeaveEntity;
```

### Step 2: Create Interface

**File:** `src/core/interfaces/leave.repository.interface.js`

```javascript
const IBaseRepository = require('./base.repository.interface');

class ILeaveRepository extends IBaseRepository {
  async approve(id) {
    throw new Error('Method "approve()" must be implemented');
  }

  async reject(id, reason) {
    throw new Error('Method "reject()" must be implemented');
  }

  async findByEmployee(employeeId, filters) {
    throw new Error('Method "findByEmployee()" must be implemented');
  }
}

module.exports = ILeaveRepository;
```

### Step 3: Implement for Each Provider

**File:** `src/infrastructure/providers/humanforce/humanforce.leave.repository.js`

```javascript
const ILeaveRepository = require('../../../core/interfaces/leave.repository.interface');
const LeaveEntity = require('../../../core/entities/leave.entity');

class HumanForceLeaveRepository extends ILeaveRepository {
  constructor(httpClient) {
    super();
    this.client = httpClient;
  }

  mapToEntity(data) {
    return new LeaveEntity({
      id: data.id,
      employeeId: data.employee_id,
      startDate: new Date(data.start_date),
      endDate: new Date(data.end_date),
      type: data.leave_type,
      status: data.status,
      reason: data.reason,
    });
  }

  async findById(id) {
    const response = await this.client.get(`/leaves/${id}`);
    return this.mapToEntity(response.data);
  }

  async approve(id) {
    await this.client.post(`/leaves/${id}/approve`);
    return this.findById(id);
  }

  // Implement other methods...
}

module.exports = HumanForceLeaveRepository;
```

### Step 4: Create Service

**File:** `src/services/leave.service.js`

```javascript
class LeaveService {
  constructor({ createLeaveRepository, provider }) {
    this.repository = createLeaveRepository(provider);
  }

  async getById(id) {
    return this.repository.findById(id);
  }

  async approve(id, approverId) {
    // Business logic
    const leave = await this.repository.findById(id);
    if (leave.status !== 'pending') {
      throw new Error('Leave not in pending status');
    }
    
    return this.repository.approve(id);
  }

  // Other methods...
}

module.exports = LeaveService;
```

### Step 5: Register in DI

**File:** [src/di/container.js](src/di/container.js)

```javascript
const LeaveService = require('../services/leave.service');
const HumanForceLeaveRepository = require('../infrastructure/providers/humanforce/humanforce.leave.repository');

container.register({
  leaveService: awilix.asClass(LeaveService).scoped(),
  
  createLeaveRepository: awilix.asFunction(({ createHttpClient }) => {
    return (providerName) => {
      const httpClient = createHttpClient(providerName);
      
      switch (providerName) {
        case 'humanforce':
          return new HumanForceLeaveRepository(httpClient);
        default:
          throw new Error(`Leave not supported for: ${providerName}`);
      }
    };
  }).singleton(),
});
```

### Step 6: Usage

```javascript
const ThirdPartyService = require('./src/services/third-party.service');

const leaveService = ThirdPartyService.createLeaveServiceInstance('humanforce');
const leave = await leaveService.getById(123);
await leaveService.approve(123, 'manager-001');
```

## 📝 Best Practices

1. **Always implement Interface fully** - Ensure all repositories follow the interface contract
2. **Validate at Entity level** - Business rules in entities, independent of provider
3. **Consistent Error Handling** - Use custom errors from `shared/errors`
4. **Bidirectional data mapping** - `mapToEntity()` and `mapToApiFormat()`
5. **Provider-specific config** - Each provider has its own config, validated via Joi
6. **Test each layer** - Mock dependencies for isolated testing

## 🔧 Commands

```bash
npm start              # Run demo
npm run dev           # Development mode
npm test              # Run tests
```
