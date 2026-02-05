# Multiple 3rd Party Structure Template

A flexible and extensible Node.js template for integrating multiple third-party timesheet systems using the **Strategy Pattern** and **Factory Pattern**.

## Overview

This project demonstrates a clean architecture for managing multiple third-party integrations, specifically designed for timesheet services. It provides a unified interface to interact with different providers (Employment Hero, Humanforce, MYOB) while maintaining separation of concerns and easy extensibility.

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

### 3. Register in Factory

Update `factories/timesheet.factory.js`:

```javascript
const NewProviderTimeSheetService = require("../services/newprovider/timesheet.service");
const NewProviderStrategy = require("../strategy/newprovider.strategy");

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

- `list(...params)` - Retrieve a list of records
- `get(...params)` - Retrieve a single record by ID
- `create(...params)` - Create a new record
- `update(...params)` - Update an existing record
- `delete(...params)` - Delete a record

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
