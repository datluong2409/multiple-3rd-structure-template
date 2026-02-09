const awilix = require('awilix');
const config = require('../config');
const logger = require('../shared/logger');

// HTTP Clients
const EHHttpClient = require('../infrastructure/providers/employment-hero/eh.http-client');
const HumanForceHttpClient = require('../infrastructure/providers/humanforce/humanforce.http-client');
const MYOBHttpClient = require('../infrastructure/providers/myob/myob.http-client');

// Repositories
const EHTimesheetRepository = require('../infrastructure/providers/employment-hero/eh.timesheet.repository');
const HumanForceTimesheetRepository = require('../infrastructure/providers/humanforce/humanforce.timesheet.repository');
const MYOBTimesheetRepository = require('../infrastructure/providers/myob/myob.timesheet.repository');

// Services
const TimesheetService = require('../application/services/timesheet.service');

// Create container
const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

// Register dependencies
container.register({
  // Config & Logger
  config: awilix.asValue(config),
  logger: awilix.asValue(logger),

  // HTTP Clients
  ehHttpClient: awilix.asClass(EHHttpClient).singleton(),
  humanforceHttpClient: awilix.asClass(HumanForceHttpClient).singleton(),
  myobHttpClient: awilix.asClass(MYOBHttpClient).singleton(),

  // Repositories
  ehTimesheetRepository: awilix.asClass(EHTimesheetRepository).scoped(),
  humanforceTimesheetRepository: awilix.asClass(HumanForceTimesheetRepository).scoped(),
  myobTimesheetRepository: awilix.asClass(MYOBTimesheetRepository).scoped(),

  // Services
  timesheetService: awilix.asClass(TimesheetService).scoped(),
});

/**
 * Create HTTP Client based on provider name
 */
container.register({
  createHttpClient: awilix.asFunction(({ config, logger }) => {
    return (providerName) => {
      const providerConfig = config.providers[providerName];
      if (!providerConfig) {
        throw new Error(`Unknown provider: ${providerName}`);
      }

      switch (providerName) {
        case 'employmentHero':
          return new EHHttpClient(providerConfig, logger);
        case 'humanforce':
          return new HumanForceHttpClient(providerConfig, logger);
        case 'myob':
          return new MYOBHttpClient(providerConfig, logger);
        default:
          throw new Error(`Unsupported provider: ${providerName}`);
      }
    };
  }).singleton(),
});

/**
 * Create Timesheet Repository based on provider name
 */
container.register({
  createTimesheetRepository: awilix.asFunction(({ createHttpClient, logger }) => {
    return (providerName) => {
      const httpClient = createHttpClient(providerName);

      switch (providerName) {
        case 'employmentHero':
          return new EHTimesheetRepository(httpClient, logger);
        case 'humanforce':
          return new HumanForceTimesheetRepository(httpClient, logger);
        case 'myob':
          return new MYOBTimesheetRepository(httpClient, logger);
        default:
          throw new Error(`Unsupported provider: ${providerName}`);
      }
    };
  }).singleton(),
});

module.exports = container;
