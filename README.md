# Multi-Provider Integration Template

Clean Architecture template for integrating multiple third-party providers using **Repository Pattern** and **Dependency Injection**.

## 📦 Stack

- **Architecture:** Clean Architecture + Repository Pattern
- **DI Container:** Awilix
- **HTTP Client:** Axios + Retry Logic
- **Logging:** Winston
- **Config:** Joi Validation
- **Current Providers:** Employment Hero, HumanForce, MYOB

## 📁 Structure

```
src/
├── core/                    # Domain Layer
│   ├── entities/           # Domain models with validation
│   └── interfaces/         # Repository & Provider interfaces
│
├── infrastructure/         # External Dependencies
│   ├── http/              # Base HTTP client
│   └── providers/         # Provider implementations
│       └── {provider}/    # One folder per provider
│           ├── {provider}.auth-provider.js
│           ├── {provider}.http-client.js
│           └── {provider}.{resource}.repository.js
│
├── application/           # Business Logic
│   └── services/         # Orchestration services
│
├── di/                   # Dependency Injection
│   └── container.js      # Awilix container
│
├── config/              # Configuration
│   └── index.js        # Joi validation
│
└── shared/             # Cross-cutting
    ├── errors/        # Custom errors
    └── logger/       # Winston logger
```

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your API keys (optional for demo)
```

## ⚙️ Configuration

Edit `.env` file with your provider credentials:

```env
# Employment Hero
EH_API_KEY=your_eh_api_key
EH_BASE_URL=https://api.employmenthero.com/v1
EH_TIMEOUT=30000

# HumanForce
HUMA� Quick Start

```bash
npm install
cp .env.example .env   # Optional, works with defaults
npm start
```

## 💡 Usage Example

```javascript
const container = require('./src/di/container');
const timesheetService = container.resolve('timesheetService');

// Get timesheet from any provider
const timesheet = await timesheetService.getTimesheet('employmentHero', 1);

// Approve timesheet
await timesheetService.approveTimesheet('humanforce

```javascript
container.register({
  timesheetService: awilix.asClass(TimesheetService).scoped(),
  logger: awilix.asValue(logger),
  config: awilix.asValue(config),
});
```

### 3. Factory Method Pattern

Dynamic repository creation based on provider:

```javascript
createTimesheetRepository: (providerName) => {
  switch (providerName) {
    case 'employmentHero':
      return new EHTimesheetRepository(httpClient, logger);
    case 'humanforce':
      return new HumanForceTimesheetRepository(httpClient, logger);
    case 'myob':
      return new MYOBTimesheetRepository(httpClient, logger);
  }
}
```

## 🔌 Adding a New Provider

---

## 🔧 How to Add New Provider

### Step 1: Create Provider Files

```bash
mkdir src/infrastructure/providers/xero
```

Create 3 files:
- `xero.auth-provider.js` - Authentication logic
- `xero.http-client.js` - HTTP client wrapper
- `xero.timesheet.repository.js` - Data access

### Step 2: Implement Auth Provider

```javascript
// xero.auth-provider.js
const IAuthProvider = require('../../../core/interfaces/auth.provider.interface');
const { AuthenticationError } = require('../../../shared/errors');

class XeroAuthProvider extends IAuthProvider {
  constructor(config, logger) {
    super();
    this.config = config;
    this.logger = logger;
  }

  async authenticate() {
    this.logger.info('Authenticating with Xero API');
    // TODO: Implement real authentication
    return {
      accessToken: `xero_token_${Date.now()}`,
      expiresAt: Date.now() + 3600000,
    };
  }

  async refreshToken() {
    return this.authenticate();
  }

  async validateToken(token) {
    return true; // TODO: Implement validation
  }
}

---

## 📚 Reference

### DI Container Resolution
```javascript
const container = require('./src/di/container');

// Resolve services
const timesheetService = container.resolve('timesheetService');

// Resolve factories
const createRepo = container.resolve('createTimesheetRepository');
const repo = createRepo('employmentHero');
```

### Available Interfaces
- `IAuthProvider` - Authentication
- `IBaseRepository` - Base CRUD operations
- `ITimesheetRepository` - Timesheet-specific operations

### Custom Errors
- `BaseError` - Base error class
- `RepositoryError` - Data access errors
- `ProviderError` - Provider-specific errors
- `AuthenticationError` - Auth failures
- `ValidationError` - Validation failures

---

## 🎯 Tips

1. **Copy existing provider** as template when adding new one
2. **Always implement all interface methods** - even if they throw `Not Implemented`
3. **Use mapToEntity/mapToApiFormat** for clean data transformation
4. **Log at info level** for important operations, error level for failures
5. **Test with demo providers first** before implementing real API calls

## 📖 More Documentation

- **[COMPARISON.md](./COMPARISON.md)** - Old vs New architecture comparison
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Implementation details

---

**Architecture:** Clean Architecture + Repository Pattern + DI  
**License:**     }
  }

  // Implement: findAll, create, update, delete, approve, reject, etc.
}

module.exports = XeroTimesheetRepository;
```

### Step 5: Add Configuration

```javascript
// src/config/index.js - Add to envSchema
const envSchema = Joi.object({
  // ... existing
  XERO_API_KEY: Joi.string().default('demo-xero-key'),
  XERO_BASE_URL: Joi.string().uri().default('https://api.xero.com/api.xro/2.0'),
  XERO_TIMEOUT: Joi.number().default(30000),
});

// Add to config export
module.exports = {
  providers: {
    // ... existing
    xero: {
      name: 'Xero',
      apiKey: envVars.XERO_API_KEY,
      baseUrl: envVars.XERO_BASE_URL,
      timeout: envVars.XERO_TIMEOUT,
    },
  },
};
```

### Step 6: Register in DI Container

```javascript
// src/di/container.js
const XeroHttpClient = require('../infrastructure/providers/xero/xero.http-client');
const XeroTimesheetRepository = require('../infrastructure/providers/xero/xero.timesheet.repository');

// Update createHttpClient factory
createHttpClient: awilix.asFunction(({ config, logger }) => {
  return (providerName) => {
    const providerConfig = config.providers[providerName];
    switch (providerName) {
      // ... existing cases
      case 'xero':
        return new XeroHttpClient(providerConfig, logger);
      default:
        throw new Error(`Unsupported provider: ${providerName}`);
    }
  };
}),

// Update createTimesheetRepository factory
createTimesheetRepository: awilix.asFunction(({ createHttpClient, logger }) => {
  return (providerName) => {
    const httpClient = createHttpClient(providerName);
    switch (providerName) {
      // ... existing cases
      case 'xero':
        return new XeroTimesheetRepository(httpClient, logger);
      default:
        throw new Error(`Unsupported provider: ${providerName}`);
    }
  };
}),
```

### Step 7: Use It!

```javascript
const service = container.resolve('timesheetService');
const timesheet = await service.getTimesheet('xero', 123);
```

---

## 📋 How to Add New Resource Type (e.g., Employee)

### Step 1: Create Entity

```javascript
// src/core/entities/employee.entity.js
class EmployeeEntity {
  constructor(data = {}) {
    this.id = data.id || null;
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.email = data.email || '';
    // ... other fields
  }

  validate() {
    const errors = [];
    if (!this.email.includes('@')) errors.push('Invalid email');
    return { isValid: errors.length === 0, errors };
  }

  toJSON() {
    return { id: this.id, firstName: this.firstName, /* ... */ };
  }
}

module.exports = EmployeeEntity;
```

### Step 2: Create Interface

```javascript
// src/core/interfaces/employee.repository.interface.js
const IBaseRepository = require('./base.repository.interface');

class IEmployeeRepository extends IBaseRepository {
  async findByEmail(email) {
    throw new Error('Method "findByEmail()" must be implemented');
  }

  async activate(id) {
    throw new Error('Method "activate()" must be implemented');
  }

  async deactivate(id) {
    throw new Error('Method "deactivate()" must be implemented');
  }
}

module.exports = IEmployeeRepository;
```

### Step 3: Implement Repository for Each Provider

```javascript
// src/infrastructure/providers/employment-hero/eh.employee.repository.js
const IEmployeeRepository = require('../../../core/interfaces/employee.repository.interface');
const EmployeeEntity = require('../../../core/entities/employee.entity');

class EHEmployeeRepository extends IEmployeeRepository {
  constructor(httpClient, logger) {
    super();
    this.client = httpClient;
    this.logger = logger;
  }

  mapToEntity(data) {
    return new EmployeeEntity({
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
    });
  }

  async findById(id) {
    const data = await this.client.get(`/employees/${id}`);
    return this.mapToEntity(data);
  }

  async findByEmail(email) {
    const data = await this.client.get('/employees', { email });
    return data.map(item => this.mapToEntity(item));
  }

  // Implement all interface methods...
}

module.exports = EHEmployeeRepository;
```

### Step 4: Create Service

```javascript
// src/application/services/employee.service.js
class EmployeeService {
  constructor({ createEmployeeRepository, logger }) {
    this.createEmployeeRepository = createEmployeeRepository;
    this.logger = logger;
  }

  async getEmployee(provider, id) {
    const repository = this.createEmployeeRepository(provider);
    return repository.findById(id);
  }

  async findByEmail(provider, email) {
    const repository = this.createEmployeeRepository(provider);
    return repository.findByEmail(email);
  }

  async activateEmployee(provider, id) {
    const repository = this.createEmployeeRepository(provider);
    return repository.activate(id);
  }
}

module.exports = EmployeeService;
```

### Step 5: Register in DI Container

```javascript
// src/di/container.js
const EHEmployeeRepository = require('../infrastructure/providers/employment-hero/eh.employee.repository');
const EmployeeService = require('../application/services/employee.service');

container.register({
  // ... existing
  employeeService: awilix.asClass(EmployeeService).scoped(),
  
  createEmployeeRepository: awilix.asFunction(({ createHttpClient, logger }) => {
    return (providerName) => {
      const httpClient = createHttpClient(providerName);
      switch (providerName) {
        case 'employmentHero':
          return new EHEmployeeRepository(httpClient, logger);
        case 'humanforce':
          return new HumanForceEmployeeRepository(httpClient, logger);
        case 'myob':
          return new MYOBEmployeeRepository(httpClient, logger);
        default:
          throw new Error(`Unsupported provider: ${providerName}`);
      }
    };
  }).singleton(),
});
```

### Step 6: Use It!

```javascript
const employeeService = container.resolve('employeeService');
const employee = await employeeService.getEmployee('employmentHero', 123);
const employees = await employeeService.findByEmail('xero', 'john@example.com');
```

---

## 📝 Key Conventions

### File Naming
- Auth Provider: `{provider}.auth-provider.js`
- HTTP Client: `{provider}.http-client.js`
- Repository: `{provider}.{resource}.repository.js`
- Entity: `{resource}.entity.js`
- Interface: `{resource}.repository.interface.js`

### Method Naming
- Get single: `findById(id)`
- Get multiple: `findAll(filters)`, `findByX(x)`
- Create: `create(data)`
- Update: `update(id, data)`
- Delete: `delete(id)`
- Custom actions: `approve(id)`, `activate(id)`, etc.

### Error Handling
Always wrap in try-catch and throw custom errors:
```javascript
try {
  // API call
} catch (error) {
  this.logger.error('Operation failed', { context });
  throw new RepositoryError('Error message', error);
}
```

### Data Mapping
Always map between API format and Entity:
```javascript
mapToEntity(apiData) {
  return new Entity({
    id: apiData.id || apiData.ID,
    field: apiData.api_field || apiData.APIField,
  });
}

mapToApiFormat(entity) {
  return {
    api_field: entity.field,
  };bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## 📚 Key Benefits

1. **Maintainability** - Clean separation of concerns
2. **Testability** - Easy to mock dependencies
3. **Scalability** - Simple to add new providers
4. **Flexibility** - Swap implementations without changing business logic
5. **Error Handling** - Consistent error handling across providers
6. **Logging** - Centralized logging with different levels
7. **Configuration** - Environment-based with validation

## 🔄 Migration from Old Structure

The old structure used Strategy + Factory patterns:
- `strategies/` → Now part of `auth-provider.js`
- `services/` → Refactored to `repositories/`
- `factories/` → Replaced with DI container

Benefits of new structure:
- Better separation of concerns
- Easier testing with DI
- More flexible and extensible
- Follows industry best practices

## 📝 License

MIT
