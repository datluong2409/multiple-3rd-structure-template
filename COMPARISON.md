# So sánh Old Structure vs New Structure

## 📊 Tổng quan

### Old Structure (Strategy + Factory Pattern)
```
├── index.js
├── factories/
│   ├── base.factory.js
│   └── timesheet.factory.js
├── services/
│   ├── base/
│   │   ├── base.service.js
│   │   └── timesheet-base.service.js
│   ├── employment-hero/
│   ├── humanforce/
│   └── myob/
└── strategies/
    ├── base.strategy.js
    ├── eh.strategy.js
    ├── humanforce.strategy.js
    └── myob.strategy.js
```

### New Structure (Clean Architecture + DI)
```
├── index.js
├── src/
│   ├── core/                    # Domain layer
│   │   ├── entities/
│   │   └── interfaces/
│   ├── infrastructure/          # External dependencies
│   │   ├── http/
│   │   └── providers/
│   ├── application/            # Business logic
│   │   └── services/
│   ├── di/                     # Dependency injection
│   │   └── container.js
│   ├── config/                 # Configuration
│   └── shared/                 # Cross-cutting concerns
│       ├── errors/
│       └── logger/
```

## 🔄 So sánh chi tiết

### 1. Dependency Management

**Old:**
```javascript
// Hardcoded dependencies trong factory
class ThirdPartyTimeSheetFactory extends BaseFactory {
  constructor(strategy) {
    super(strategy);
    this.setMappings(
      new Map([
        [HumanForceStrategy, HumanForceTimeSheetService],
        [MYOBStrategy, MYOBTimeSheetService],
        [EHStrategy, EHTimeSheetService],
      ])
    );
  }
}
```

**New:**
```javascript
// DI Container tự động resolve dependencies
const container = awilix.createContainer();
container.register({
  timesheetService: awilix.asClass(TimesheetService).scoped(),
  createTimesheetRepository: awilix.asFunction(...).singleton(),
});

// Usage
const service = container.resolve('timesheetService');
```

**✅ Lợi ích:** Dễ test hơn, có thể swap implementation dễ dàng

---

### 2. Authentication Handling

**Old:**
```javascript
// Strategy chỉ chứa authentication
class EHStrategy extends BaseStrategy {
  async authenticate() {
    console.log("Authenticating with Employment Hero API");
    return { tenantId: "eh-tenant-001", userId: "eh-user-123" };
  }
}
```

**New:**
```javascript
// Auth Provider riêng biệt
class EHAuthProvider extends IAuthProvider {
  async authenticate() {
    this.logger.info('Authenticating with Employment Hero API');
    // Token management, expiry checking
    return credentials;
  }
  
  async refreshToken() { ... }
  async validateToken(token) { ... }
}

// HTTP Client tự động handle authentication
class EHHttpClient extends BaseHttpClient {
  async ensureAuthenticated() {
    if (!this.credentials) {
      const credentials = await this.authProvider.authenticate();
      this.setCredentials(credentials);
    }
  }
}
```

**✅ Lợi ích:** Token management tốt hơn, separation of concerns rõ ràng

---

### 3. Service vs Repository Pattern

**Old:**
```javascript
// Service trực tiếp gọi API và handle business logic
class EHTimeSheetService extends TimeSheetBaseService {
  get = this.apiCall((...params) => (credentialData) => {
    console.log(`Fetching timesheet ${params} from Employment Hero API`);
    console.log(credentialData);
    return { id: params[0], employee: 'Jane Smith', hours: 38 };
  });
}
```

**New:**
```javascript
// Repository chỉ handle data access
class EHTimesheetRepository extends ITimesheetRepository {
  async findById(id) {
    try {
      this.logger.info('Fetching timesheet by ID', { id });
      const data = await this.client.get(`/timesheets/${id}`);
      return this.mapToEntity(data);
    } catch (error) {
      throw new RepositoryError('Failed to fetch timesheet', error);
    }
  }
  
  mapToEntity(data) {
    return new TimesheetEntity({
      id: data.id,
      employeeName: data.employee,
      hours: data.hours,
    });
  }
}

// Service handle business logic
class TimesheetService {
  async getTimesheet(provider, id) {
    this.logger.info('Getting timesheet', { provider, id });
    const repository = this.createTimesheetRepository(provider);
    return repository.findById(id);
  }
}
```

**✅ Lợi ích:** 
- Repository: Data mapping, API calls
- Service: Business logic, orchestration
- Clear separation of concerns

---

### 4. Error Handling

**Old:**
```javascript
// Basic error handling với console.error
apiCall = (fn) => async (...params) => {
  try {
    const credentialData = await this.strategy.authenticate();
    return fn(...params)(credentialData);
  } catch (error) {
    console.error('API call failed:', error.message);
    throw new Error(`Failed to execute API call: ${error.message}`);
  }
}
```

**New:**
```javascript
// Custom error classes với proper context
class RepositoryError extends BaseError {
  constructor(message, originalError = null) {
    super(message, 500);
    this.originalError = originalError;
  }
}

class ProviderError extends BaseError {
  constructor(message, provider, originalError = null) {
    super(message, 502);
    this.provider = provider;
    this.originalError = originalError;
  }
}

// Usage
try {
  const data = await this.client.get(`/timesheets/${id}`);
  return this.mapToEntity(data);
} catch (error) {
  this.logger.error('Failed to fetch timesheet', { id, error });
  throw new RepositoryError(`Failed to fetch timesheet ${id}`, error);
}
```

**✅ Lợi ích:** 
- Error types rõ ràng
- Better error context
- Easier to handle specific errors
- Proper logging

---

### 5. Configuration Management

**Old:**
```javascript
// Không có config management
// API keys hardcoded hoặc từ env variables trực tiếp
```

**New:**
```javascript
// Centralized config với validation
const Joi = require('joi');

const envSchema = Joi.object({
  EH_API_KEY: Joi.string().default('demo-eh-key'),
  EH_BASE_URL: Joi.string().uri().required(),
  EH_TIMEOUT: Joi.number().default(30000),
  // ...
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  providers: {
    employmentHero: {
      apiKey: envVars.EH_API_KEY,
      baseUrl: envVars.EH_BASE_URL,
      timeout: envVars.EH_TIMEOUT,
    }
  }
};
```

**✅ Lợi ích:**
- Config validation
- Type safety
- Default values
- Clear configuration structure

---

### 6. Logging

**Old:**
```javascript
console.log('Fetching timesheet from Employment Hero API');
console.error('API call failed:', error.message);
```

**New:**
```javascript
const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

logger.info('Fetching timesheet', { id, provider: 'Employment Hero' });
logger.error('Failed to fetch timesheet', { id, error: error.message });
```

**✅ Lợi ích:**
- Structured logging
- Log levels
- Multiple transports (console, file)
- Better for production

---

### 7. HTTP Client

**Old:**
```javascript
// Không có HTTP client abstraction
// Mỗi service tự implement API calls
```

**New:**
```javascript
class BaseHttpClient {
  constructor(config, logger) {
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout,
    });

    // Retry logic
    axiosRetry(this.client, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
    });

    // Interceptors
    this.client.interceptors.request.use(...);
    this.client.interceptors.response.use(...);
  }
}
```

**✅ Lợi ích:**
- Retry logic
- Request/Response interceptors
- Centralized HTTP configuration
- Easy to mock for testing

---

### 8. Entity & Validation

**Old:**
```javascript
// Không có entity, data truyền trực tiếp
return { id: params[0], employee: 'Jane Smith', hours: 38 };
```

**New:**
```javascript
class TimesheetEntity {
  constructor(data = {}) {
    this.id = data.id || null;
    this.employeeId = data.employeeId || null;
    this.employeeName = data.employeeName || null;
    this.hours = data.hours || 0;
    this.status = data.status || 'pending';
  }

  validate() {
    const errors = [];
    if (this.hours < 0) errors.push('Hours must be positive');
    if (this.hours > 24) errors.push('Hours cannot exceed 24');
    
    return { isValid: errors.length === 0, errors };
  }

  toJSON() { ... }
}
```

**✅ Lợi ích:**
- Domain model
- Built-in validation
- Type safety
- Consistent data structure

---

## 📈 Testability Comparison

### Old Structure
```javascript
// Khó test vì dependencies hardcoded
const factory = new ThirdPartyTimeSheetFactory(new EHStrategy());
const service = factory.service;
```

### New Structure
```javascript
// Dễ test với DI
const mockRepository = jest.fn();
const service = new TimesheetService({
  createTimesheetRepository: () => mockRepository,
  logger: mockLogger
});
```

---

## 🎯 Khi nào dùng pattern nào?

### Old Structure (Strategy + Factory)
✅ **Phù hợp với:**
- Dự án nhỏ, đơn giản
- Ít providers (2-3)
- Team nhỏ
- Không cần testing phức tạp

### New Structure (Clean Architecture + DI)
✅ **Phù hợp với:**
- Dự án lớn, phức tạp
- Nhiều providers (4+)
- Team lớn
- Cần testing tốt
- Production application
- Long-term maintenance

---

## 📊 Metrics Comparison

| Metric | Old | New |
|--------|-----|-----|
| Lines of Code | ~300 | ~1200 |
| Files | 12 | 30+ |
| Separation of Concerns | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Testability | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Maintainability | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Learning Curve | Easy | Medium |
| Scalability | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Production Ready | ⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🚀 Migration Steps

Nếu bạn muốn migrate từ old sang new structure:

1. ✅ Setup dependencies (awilix, winston, joi)
2. ✅ Create error classes
3. ✅ Create config management
4. ✅ Create entities & interfaces
5. ✅ Implement repositories (one provider at a time)
6. ✅ Setup DI container
7. ✅ Create application services
8. ✅ Update entry point
9. ⬜ Write tests
10. ⬜ Migrate old code gradually
