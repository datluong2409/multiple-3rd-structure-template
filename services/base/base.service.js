function createBaseService(strategy) {
  if (!strategy) {
    throw new Error('Strategy is required');
  }

  const apiCall = (fn) => async (...params) => {
    try {
      const credentialData = await strategy.authenticate();
      return fn(...params)(credentialData);
    } catch (error) {
      console.error('API call failed:', error.message);
      throw new Error(`Failed to execute API call: ${error.message}`);
    }
  };

  const service = {
    strategy,
    apiCall,
    
    list(...params) {
      throw new Error('Method "list()" must be implemented.');
    },

    get(...params) {
      throw new Error('Method "get()" must be implemented.');
    },

    create(...params) {
      throw new Error('Method "create()" must be implemented.');
    },

    update(...params) {
      throw new Error('Method "update()" must be implemented.');
    },

    delete(...params) {
      throw new Error('Method "delete()" must be implemented.');
    }
  };

  // Return proxy to intercept method calls if needed
  return new Proxy(service, {
    get(target, prop) {
      return target[prop];
    }
  });
}

module.exports = createBaseService;
