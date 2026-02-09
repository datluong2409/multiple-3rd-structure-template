const dotenv = require('dotenv');
const Joi = require('joi');

// Load environment variables
dotenv.config();

// Define validation schema
const envSchema = Joi.object({
  // Employment Hero
  EH_API_KEY: Joi.string().default('demo-eh-key'),
  EH_BASE_URL: Joi.string().uri().default('https://api.employmenthero.com/v1'),
  EH_TIMEOUT: Joi.number().default(30000),
  
  // HumanForce
  HUMANFORCE_API_KEY: Joi.string().default('demo-humanforce-key'),
  HUMANFORCE_BASE_URL: Joi.string().uri().default('https://api.humanforce.com/v1'),
  HUMANFORCE_TIMEOUT: Joi.number().default(30000),
  
  // MYOB
  MYOB_API_KEY: Joi.string().default('demo-myob-key'),
  MYOB_BASE_URL: Joi.string().uri().default('https://api.myob.com/v1'),
  MYOB_TIMEOUT: Joi.number().default(30000),
  
  // Application
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),
}).unknown();

// Validate environment variables
const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Export configuration
const config = {
  env: envVars.NODE_ENV,
  logLevel: envVars.LOG_LEVEL,
  
  providers: {
    employmentHero: {
      name: 'Employment Hero',
      apiKey: envVars.EH_API_KEY,
      baseUrl: envVars.EH_BASE_URL,
      timeout: envVars.EH_TIMEOUT,
    },
    humanforce: {
      name: 'HumanForce',
      apiKey: envVars.HUMANFORCE_API_KEY,
      baseUrl: envVars.HUMANFORCE_BASE_URL,
      timeout: envVars.HUMANFORCE_TIMEOUT,
    },
    myob: {
      name: 'MYOB',
      apiKey: envVars.MYOB_API_KEY,
      baseUrl: envVars.MYOB_BASE_URL,
      timeout: envVars.MYOB_TIMEOUT,
    },
  },
};

module.exports = config;
