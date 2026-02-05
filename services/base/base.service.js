class BaseService {
  constructor(strategy) {
      if (!strategy) {
        throw new Error('Strategy is required');
      }
      this.strategy = strategy;
  }

  apiCall =
	(fn) =>
	async (...params) => {
		try {
			const credentialData = await this.strategy.authenticate();
			return fn(...params)(credentialData);
		} catch (error) {
			console.error('API call failed:', error.message);
			throw new Error(`Failed to execute API call: ${error.message}`);
		}
	}

  list(...params) {
    throw new Error('Method "list()" must be implemented.');
  }

  get(...params) {
    throw new Error('Method "get()" must be implemented.');
  }

  create(...params) {
    throw new Error('Method "create()" must be implemented.');
  }

  update(...params) {
    throw new Error('Method "update()" must be implemented.');
  }

  delete(...params) {
    throw new Error('Method "delete()" must be implemented.');
  }
}
module.exports = BaseService;
