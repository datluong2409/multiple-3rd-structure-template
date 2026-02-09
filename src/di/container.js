const awilix = require('awilix');
const { getConfig } = require('../config');

// HTTP Clients
const HumanForceHttpClient = require('../infrastructure/providers/humanforce/humanforce.http-client');

// Repositories
const HumanForceTimesheetRepository = require('../infrastructure/providers/humanforce/humanforce.timesheet.repository');

// Services
const TimesheetService = require('../application/services/timesheet.service');

// Create container
const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

// Register dependencies
container.register({
  // Config & Logger
  config: awilix.asFunction(() => getConfig()).scoped(),

  // HTTP Clients
  humanforceHttpClient: awilix.asClass(HumanForceHttpClient).singleton(),
  // Repositories
  humanforceTimesheetRepository: awilix.asClass(HumanForceTimesheetRepository).scoped(),

  // Services
  timesheetService: awilix.asClass(TimesheetService).scoped(),
});

/**
 * Create HTTP Client based on provider name
 */
container.register({
  createHttpClient: awilix.asFunction(({ config }) => {
    return (providerName) => {
      const providerConfig = config.providers[providerName];
      if (!providerConfig) {
        throw new Error(`Unknown provider: ${providerName}`);
      }

      switch (providerName) {
        case 'humanforce':
          return new HumanForceHttpClient(providerConfig);
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
  createTimesheetRepository: awilix.asFunction(({ createHttpClient }) => {
    return (providerName) => {
      const httpClient = createHttpClient(providerName);

      switch (providerName) {
        case 'humanforce':
          return new HumanForceTimesheetRepository(httpClient);
        default:
          throw new Error(`Unsupported provider: ${providerName}`);
      }
    };
  }).singleton(),
});

module.exports = container;
