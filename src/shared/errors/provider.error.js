const BaseError = require('./base.error');

/**
 * Error thrown when a provider operation fails
 */
class ProviderError extends BaseError {
  constructor(message, provider, originalError = null) {
    super(message, 502);
    this.provider = provider;
    this.originalError = originalError;
  }
}

module.exports = ProviderError;
