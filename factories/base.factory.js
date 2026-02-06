function createBaseFactory(strategy, mappings = new Map()) {
  if (!strategy) {
    throw new Error("Strategy is required");
  }

  const factory = {
    strategy,
    service: null,
    mappings,

    dispatchService() {
      for (const [strategyType, serviceCreator] of this.mappings) {
        if (this.strategy.strategyType === strategyType) {
          this.service = serviceCreator(this.strategy);
          return;
        }
      }
      throw new Error(`Unsupported strategy: ${this.strategy.strategyType}`);
    },

    setMappings(newMappings) {
      this.mappings = newMappings;
    }
  };

  return new Proxy(factory, {
    get(target, prop) {
      return target[prop];
    }
  });
}

module.exports = createBaseFactory;
