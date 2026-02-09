const BaseError = require('./base.error');

/**
 * Error thrown when validation fails
 */
class ValidationError extends BaseError {
  constructor(message, errors = []) {
    super(message, 400);
    this.errors = errors;
  }
}

module.exports = ValidationError;
