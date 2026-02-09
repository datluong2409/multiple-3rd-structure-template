const BaseError = require('./base.error');
const ProviderError = require('./provider.error');
const ValidationError = require('./validation.error');
const AuthenticationError = require('./authentication.error');
const RepositoryError = require('./repository.error');

module.exports = {
  BaseError,
  ProviderError,
  ValidationError,
  AuthenticationError,
  RepositoryError
};
