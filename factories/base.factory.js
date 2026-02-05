class BaseFactory {
  #mappings = new Map();
  strategy = null;
  service = null;

  constructor(strategy) {
    if (!strategy) {
      throw new Error("Strategy is required");
    }

    this.strategy = strategy;
  }

  dispatchService() {
    for (const [Strategy, Service] of this.#mappings) {
      if (this.strategy instanceof Strategy) {
        this.service = new Service(this.strategy);
        return;
      }
    }
    throw new Error("Unsupported strategy");
  }

  setMappings(mappings) {
    this.#mappings = mappings;
  }
}

module.exports = BaseFactory;
