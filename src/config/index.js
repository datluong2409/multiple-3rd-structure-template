const { AsyncLocalStorage } = require('async_hooks');
const Joi = require('joi');

// Create AsyncLocalStorage instance
const configStorage = new AsyncLocalStorage();

// Define validation schema
const configSchema = Joi.object({
  env: Joi.string().valid('development', 'production', 'test').default('development'),
  logLevel: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),
  
  providers: Joi.object({
    employmentHero: Joi.object({
      name: Joi.string().default('Employment Hero'),
      apiKey: Joi.string().required(),
      baseUrl: Joi.string().uri().required(),
      timeout: Joi.number().default(30000),
    }).optional(),
    
    humanforce: Joi.object({
      name: Joi.string().default('HumanForce'),
      apiKey: Joi.string().required(),
      baseUrl: Joi.string().uri().required(),
      timeout: Joi.number().default(30000),
    }).optional(),
    
    myob: Joi.object({
      name: Joi.string().default('MYOB'),
      apiKey: Joi.string().required(),
      baseUrl: Joi.string().uri().required(),
      timeout: Joi.number().default(30000),
    }).optional(),
  }).required(),
}).required();

/**
 * Get current config from AsyncLocalStorage
 * @returns {Object} Current configuration
 * @throws {Error} If config is not set in current context
 */
function getConfig() {
  const config = configStorage.getStore();
  if (!config) {
    throw new Error('Config not found in current context. Make sure to run code within runWithConfig.');
  }
  return config;
}

/**
 * Set config and run callback within that context
 * @param {Object} config - Configuration object
 * @param {Function} callback - Function to run with config context
 * @returns {Promise<any>} Result of callback execution
 */
async function runWithConfig(config, callback) {
  // Validate config
  const { error, value: validatedConfig } = configSchema.validate(config);
  
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
  
  // Run callback within AsyncLocalStorage context
  return configStorage.run(validatedConfig, callback);
}

/**
 * Create a default config for demo/testing purposes
 * @returns {Object} Default configuration
 */
function createDefaultConfig() {
  return {
    env: 'development',
    logLevel: 'info',
    providers: {
      employmentHero: {
        name: 'Employment Hero',
        apiKey: 'demo-eh-key',
        baseUrl: 'https://api.employmenthero.com/v1',
        timeout: 30000,
      },
      humanforce: {
        name: 'HumanForce',
        apiKey: 'demo-humanforce-key',
        baseUrl: 'https://api.humanforce.com/v1',
        timeout: 30000,
      },
      myob: {
        name: 'MYOB',
        apiKey: 'demo-myob-key',
        baseUrl: 'https://api.myob.com/v1',
        timeout: 30000,
      },
    },
  };
}

module.exports = {
  getConfig,
  runWithConfig,
  createDefaultConfig,
  configStorage, // Export for testing purposes
};
