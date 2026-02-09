# Multiple Third-Party Integration Template v2.0

A robust Node.js application template for integrating multiple third-party providers using **Clean Architecture**, **Repository Pattern**, and **Dependency Injection**.

## 🚀 Features

- ✅ **Clean Architecture** - Separation of concerns with clear boundaries
- ✅ **Repository Pattern** - Abstraction over data access
- ✅ **Dependency Injection** - Using Awilix for IoC
- ✅ **SOLID Principles** - Maintainable and extensible code
- ✅ **Error Handling** - Comprehensive error types
- ✅ **Logging** - Winston logger with different levels
- ✅ **Configuration Management** - Environment-based config with validation
- ✅ **Type Safety** - Interface-based design
- ✅ **HTTP Client** - Axios with retry logic
- ✅ **Multi-Provider Support** - Employment Hero, HumanForce, MYOB

## 📁 Project Structure

```
src/
├── core/                           # Domain layer (business logic)
│   ├── entities/                  # Domain entities
│   │   └── timesheet.entity.js
│   └── interfaces/                # Repository interfaces
│       ├── auth.provider.interface.js
│       ├── base.repository.interface.js
│       └── timesheet.repository.interface.js
│
├── infrastructure/                 # External dependencies
│   ├── http/                      # HTTP client infrastructure
│   │   └── base.http-client.js
│   └── providers/                 # Provider-specific implementations
│       ├── employment-hero/
│       │   ├── eh.auth-provider.js
│       │   ├── eh.http-client.js
│       │   └── eh.timesheet.repository.js
│       ├── humanforce/
│       │   ├── humanforce.auth-provider.js
│       │   ├── humanforce.http-client.js
│       │   └── humanforce.timesheet.repository.js
│       └── myob/
│           ├── myob.auth-provider.js
│           ├── myob.http-client.js
│           └── myob.timesheet.repository.js
│
├── application/                    # Application layer
│   └── services/
│       └── timesheet.service.js   # Business logic orchestration
│
├── di/                            # Dependency injection
│   └── container.js               # Awilix container setup
│
├── config/                        # Configuration
│   └── index.js                   # Environment config & validation
│
└── shared/                        # Cross-cutting concerns
    ├── errors/                    # Custom error classes
    │   ├── base.error.js
    │   ├── provider.error.js
    │   ├── validation.error.js
    │   ├── authentication.error.js
    │   ├── repository.error.js
    │   └── index.js
    └── logger/                    # Logging utility
        └── index.js

index.js                           # Application entry point
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
HUMANFORCE_API_KEY=your_humanforce_api_key
HUMANFORCE_BASE_URL=https://api.humanforce.com/v1
HUMANFORCE_TIMEOUT=30000

# MYOB
MYOB_API_KEY=your_myob_api_key
MYOB_BASE_URL=https://api.myob.com/v1
MYOB_TIMEOUT=30000

# Application
NODE_ENV=development
LOG_LEVEL=info
```

## 🎯 Usage

### Run the Application

```bash
npm start
```

### Using the Timesheet Service

```javascript
const container = require('./src/di/container');

// Resolve service from DI container
const timesheetService = container.resolve('timesheetService');

// Get timesheet from Employment Hero
const timesheet = await timesheetService.getTimesheet('employmentHero', 1);

// List timesheets from HumanForce
const timesheets = await timesheetService.listTimesheets('humanforce', { status: 'pending' });

// Create timesheet in MYOB
const newTimesheet = await timesheetService.createTimesheet('myob', {
  employeeId: 'emp-123',
  hours: 8,
  status: 'pending'
});

// Approve timesheet
await timesheetService.approveTimesheet('employmentHero', 1);
```

## 🏗️ Architecture Patterns

### 1. Repository Pattern

Each provider has its own repository implementing the same interface:

```javascript
class ITimesheetRepository {
  async findById(id) {}
  async findAll(filters) {}
  async create(data) {}
  async update(id, data) {}
  async delete(id) {}
  async approve(id) {}
  async reject(id, reason) {}
}
```

### 2. Dependency Injection

Using Awilix for automatic dependency resolution:

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

1. **Create provider files:**
```bash
src/infrastructure/providers/new-provider/
├── new-provider.auth-provider.js
├── new-provider.http-client.js
└── new-provider.timesheet.repository.js
```

2. **Implement interfaces:**
   - Extend `IAuthProvider`
   - Extend `BaseHttpClient`
   - Extend `ITimesheetRepository`

3. **Register in DI container:**
```javascript
// src/di/container.js
const NewProviderHttpClient = require('../infrastructure/providers/new-provider/new-provider.http-client');
const NewProviderRepository = require('../infrastructure/providers/new-provider/new-provider.timesheet.repository');

// Add to createHttpClient factory
case 'newProvider':
  return new NewProviderHttpClient(providerConfig, logger);

// Add to createTimesheetRepository factory
case 'newProvider':
  return new NewProviderRepository(httpClient, logger);
```

4. **Add configuration:**
```javascript
// src/config/index.js
providers: {
  newProvider: {
    name: 'New Provider',
    apiKey: envVars.NEW_PROVIDER_API_KEY,
    baseUrl: envVars.NEW_PROVIDER_BASE_URL,
    timeout: envVars.NEW_PROVIDER_TIMEOUT,
  }
}
```

## 🧪 Testing

```bash
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
