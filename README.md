# Multiple 3rd Party Structure Template

A flexible and extensible Node.js template for integrating multiple third-party services using the **Strategy Pattern** and **Factory Pattern**.

## Overview

This project demonstrates a clean architecture for managing multiple third-party integrations across various service types. Currently implemented with timesheet services as an example, it provides a unified interface to interact with different providers (Employment Hero, Humanforce, MYOB) while maintaining separation of concerns and easy extensibility.

The architecture is designed to support **multiple service types** (timesheet, employee, payroll, leave, etc.) across multiple providers using the same pattern.

## Architecture

The project uses two main design patterns:

### 1. **Strategy Pattern**
Each third-party provider is represented by a strategy class that handles authentication and provider-specific logic.

### 2. **Factory Pattern**
The factory dynamically instantiates the correct service implementation based on the provided strategy.

## Supported Providers

- **Employment Hero (EH)** - Time and attendance management system
- **Humanforce** - Workforce management platform
- **MYOB** - Accounting and payroll software

## Project Structure

```
├── index.js                          # Main entry point with demo examples
├── factories/
│   ├── base.factory.js              # Base factory with strategy-to-service mapping
│   └── timesheet.factory.js         # Timesheet-specific factory implementation
├── services/
│   ├── base/
│   │   ├── base.service.js          # Abstract base service with CRUD operations
│   │   └── timesheet-base.service.js # Timesheet-specific base service
│   ├── employment-hero/
│   │   └── timesheet.service.js     # Employment Hero timesheet implementation
│   ├── humanforce/
│   │   └── timesheet.service.js     # Humanforce timesheet implementation
│   └── myob/
│       └── timesheet.service.js     # MYOB timesheet implementation
└── strategy/
    ├── base.strategy.js              # Abstract base strategy
    ├── eh.strategy.js                # Employment Hero strategy
    ├── humanforce.strategy.js        # Humanforce strategy
    └── myob.strategy.js              # MYOB strategy
```

## Usage

### Basic Example

```javascript
const ThirdPartyTimeSheetFactory = require("./factories/timesheet.factory");
const HumanForceStrategy = require("./strategy/humanforce.strategy");

async function example() {
    // Create factory with desired strategy
    const factory = new ThirdPartyTimeSheetFactory(new HumanForceStrategy());
    const service = factory.service;

    // Use the service
    const timesheet = await service.get(1);
    console.log(timesheet);
}

example();
```

### Running the Demo

The [index.js](index.js) file contains demonstration examples for all three providers:

```bash
node index.js
```

This will execute timesheet retrieval for all three providers sequentially.

## How It Works

1. **Strategy Selection**: Choose a provider by instantiating its strategy class
2. **Factory Creation**: Pass the strategy to `ThirdPartyTimeSheetFactory`
3. **Service Dispatch**: The factory automatically maps the strategy to the correct service implementation
4. **API Calls**: The service handles authentication via the strategy and executes API operations

### Flow Diagram

```
Strategy → Factory → Service → API Call
                ↓
         Authentication
```

## Adding a New Service Type

To add a new service type (e.g., Employee, Payroll, Leave), follow these steps:

### 1. Create a Base Service

Create a new base service file in `services/base/`:

```javascript
// services/base/employee-base.service.js
const BaseService = require("./base.service");

class EmployeeBaseService extends BaseService {
  constructor(strategy) {
    super(strategy);
  }

  // Override or add service-specific methods if needed
  async getByEmail(email) {
    throw new Error('Method "getByEmail()" must be implemented.');
  }
}

module.exports = EmployeeBaseService;
```

### 2. Create Provider-Specific Services
Services for All Service Types

Create service files for each service type in `services/newprovider/`:

```javascript
// services/newprovider/timesheet.service.js
const TimeSheetBaseService = require("../base/timesheet-base.service");

class NewProviderTimeSheetService extends TimeSheetBaseService {
  async get(id) {
    return this.apiCall((id) => async (credentialData) => {
      // Implement get logic using credentialData
      return { id, provider: "NewProvider", /* ... */ };
    })(id);
  }

  // Implement other methods: list, create, update, delete
}
module.exports = NewProviderTimeSheetService;
```

```javascript
// services/newprovider/employee.service.js
const EmployeeBaseService = require("../base/employee-base.service");

class NewProviderEmployeeService extends EmployeeBaseService {
  async get(id) {
    return this.apiCall((id) => async (credentialData) => {
      return { id, name: "Employee", provider: "NewProvider" };
    })(id);
  }

  // Implement other methods
}
module.exports = NewProviderEmployeeService;
```

**Note**: You should create a service for each service type (timesheet, employee, payroll, etc.) that your provider supports.
  async list() {
    return this.apiCall(() => async (credentialData) => {
      console.log(`[${this.strategy.name}] Listing employees`);
      return [{ id: 1, name: "John Doe" }, { id: 2, name: "Jane Smith" }];
    })();
  }

  // Implement other methods: create, update, delete, getByEmail
}

module.exports = EHEmployeeService;
```

### 3. Create a Factory

Create a new factory file in `factories/`:

```javascript
// factories/employee.factory.js
const EHEmployeeService = require("../services/employment-hero/employee.service");
const HumanForceEmployeeService = require("../services/humanforce/employee.service");
const MYOBEmployeeService = require("../services/myob/employee.service");
const EHStrategy = require("../strategy/eh.strategy");
const HumanForceStrategy = require("../strategy/humanforce.strategy");
const MYOBStrategy = require("../strategy/myob.strategy");
const BaseFactory = require("./base.factory");

class ThirdPartyEmployeeFactory extends BaseFactory {
  /**
   * @type {HumanForceEmployeeService | MYOBEmployeeService | EHEmployeeService}
   */
  service = null;

  constructor(strategy) {
    super(strategy);

    this.setMappings(
      new Map([
        [HumanForceStrategy, HumanForceEmployeeService],
        [MYOBStrategy, MYOBEmployeeService],
        [EHStrategy, EHEmployeeService],
      ]),
    );

    this.dispatchService();
  }
}

module.exports = ThirdPartyEmployeeFactory;
```

### 4. Use the New Service

```javascript
const ThirdPartyEmployeeFactory = require("./factories/employee.factory");
const EHStrategy = require("./strategy/eh.strategy");

async function example() {
    const factory = new ThirdPartyEmployeeFactory(new EHStrategy());
    const employeeService = factory.service;

    const employee = await employeeService.get(1);
    console.log(employee);
}
```

### Multiple Service Types Example

You can use multiple service types with the same provider:

```javascript
const ThirdPartyTimeSheetFactory = require("./factories/timesheet.factory");
const ThirdPartyEmployeeFactory = require("./factories/employee.factory");
const ThirdPartyPayrollFactory = require("./factories/payroll.factory");
const EHStrategy = require("./strategy/eh.strategy");

async function example() {
    const strategy = new EHStrategy();
    
    // Create multiple factories with the same strategy
    const timesheetService = new ThirdPartyTimeSheetFactory(strategy).service;
    const employeeService = new ThirdPartyEmployeeFactory(strategy).service;
    const payrollService = new ThirdPartyPayrollFactory(strategy).service;
    
    // Use all services
    const timesheet = await timesheetService.get(1);
    const employee = await employeeService.get(1);
    const payroll = await payrollService.get(1);
}
```

## Adding a New Provider

To add a new third-party provider, follow these steps:

### 1. Create a Strategy

Create a new strategy file in `strategy/`:

```javascript
// strategy/newprovider.strategy.js
const BaseStrategy = require("./base.strategy");

class NewProviderStrategy extends BaseStrategy {
  name = "NewProvider";

  async authenticate() {
    // Implement authentication logic
    return {
      tenantId: "provider-tenant-id",
      userId: "provider-user-id",
      // ... authentication data
    };
  }
}
module.exports = NewProviderStrategy;
```

### 2. Create a Service

Create a new service file in `services/newprovider/`:
All Factories

Update each factory to include the new provider:

**timesheet.factory.js**:
```javascript
const NewProviderTimeSheetService = require("../services/newprovider/timesheet.service");
const NewProviderStrategy = require("../strategy/newprovider.strategy");

this.setMappings(
  new Map([
    [HumanForceStrategy, HumanForceTimeSheetService],
    [MYOBStrategy, MYOBTimeSheetService],
    [EHStrategy, EHTimeSheetService],
    [NewProviderStrategy, NewProviderTimeSheetService], // Add this
  ]),
);
```

**employee.factory.js**:
```javascript
const NewProviderEmployeeService = require("../services/newprovider/employee.service");
const NewProviderStrategy = require("../strategy/newprovider.strategy");

this.setMappings(
  new Map([
    [HumanForceStrategy, HumanForceEmployeeService],
    [MYOBStrategy, MYOBEmployeeService],
    [EMulti-Service Support**: Easily support multiple service types (timesheet, employee, payroll, etc.)
- ✅ **Multi-Provider**: Support multiple third-party providers with consistent interface
- ✅ **Extensible**: Easy to add new providers or service types without modifying existing code
- ✅ **Type-Safe**: JSDoc annotations for better IDE support
- ✅ **Separation of Concerns**: Clear separation between authentication and business logic
- ✅ **Reusable**: Base classes reduce code duplication
- ✅ **Strategy Reuse**: One strategy instance can be used across multiple service types
```

Repeat for all other service type factories.st NewProviderStrategy = require("../strategy/newprovider.strategy");

class ThirdPartyTimeSheetFactory extends BaseFactory {
  constructor(strategy) {
    super(strategy);

    this.setMappings(
      new Map([
        [HumanForceStrategy, HumanForceTimeSheetService],
        [MYOBStrategy, MYOBTimeSheetService],
        [EHStrategy, EHTimeSheetService],
        [NewProviderStrategy, NewProviderTimeSheetService], // Add this line
      ]),
    );

    this.dispatchService();
  }
}
```

## Key Features

- ✅ **Extensible**: Easy to add new providers without modifying existing code
- ✅ **Type-Safe**: JSDoc annotations for better IDE support
- ✅ **Separation of Concerns**: Clear separation between authentication and business logic
- ✅ **Reusable**: Base classes reduce code duplication
- ✅ **Error Handling**: Built-in error handling for API calls

## API Reference

### BaseService Methods

All service implementations inherit these methods:
Architecture Benefits

### Scalability Matrix

| Providers → | EH | Humanforce | MYOB | New Provider |
|------------|----|-----------:|------|--------------|
| **Timesheet** | ✓ | ✓ | ✓ | ✓ |
| **Employee** | ✓ | ✓ | ✓ | ✓ |
| **Payroll** | ✓ | ✓ | ✓ | ✓ |
| **Leave** | ✓ | ✓ | ✓ | ✓ |
| **New Service** | ✓ | ✓ | ✓ | ✓ |

This architecture allows you to:
- Add a new **provider** → Create 1 strategy + N services (one per service type)
- Add a new **service type** → Create 1 factory + 1 base service + M implementations (one per provider)

## Best Practices

1. **Keep Strategies Lightweight**: Strategies should only handle authentication and provider-specific configuration
2. **Implement All CRUD Operations**: Services should implement all base methods for consistency
3. **Reuse Strategy Instances**: Create one strategy instance and pass it to multiple factories for different service types
4. **Use Type Annotations**: Add JSDoc comments for better IDE support
5. **Handle Errors Gracefully**: Use try-catch blocks and provide meaningful error messages
6. **Test Each Provider**: Ensure each provider works independently
7. **Create Service-Specific Base Classes**: Extend BaseService for each service type to add domain-specific methods
8. **Consistent Naming**: Follow the naming convention: `{Provider}{ServiceType}Service` (e.g., `EHEmployeeService`)
### BaseStrategy Methods

All strategies must implement:

- `authenticate()` - Returns authentication credentials for API calls

## Best Practices

1. **Keep Strategies Lightweight**: Strategies should only handle authentication and provider-specific configuration
2. **Implement All CRUD Operations**: Services should implement all base methods for consistency
3. **Use Type Annotations**: Add JSDoc comments for better IDE support
4. **Handle Errors Gracefully**: Use try-catch blocks and provide meaningful error messages
5. **Test Each Provider**: Ensure each provider works independently

## License

This is a template project for internal use.

## Contributing

When adding new providers or features:
1. Follow the existing code structure
2. Maintain consistency with naming conventions
3. Document your changes
4. Test thoroughly with the new provider

---

**Note**: This template uses mock authentication data. In production, implement proper authentication flows with real API credentials, environment variables, and secure credential storage.
