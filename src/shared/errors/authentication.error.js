const BaseError = require('./base.error');

/**
 * Error thrown when authentication fails
 */
class AuthenticationError extends BaseError {
  constructor(message, provider) {
    super(message, 401);
    this.provider = provider;
  }
}

module.exports = AuthenticationError;
