const BaseError = require('./base.error');

/**
 * Error thrown when a repository operation fails
 */
class RepositoryError extends BaseError {
  constructor(message, originalError = null) {
    super(message, 500);
    this.originalError = originalError;
  }
}

module.exports = RepositoryError;
