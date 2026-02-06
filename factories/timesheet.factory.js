const createEHTimeSheetService = require("../services/employment-hero/timesheet.service");
const createHumanForceTimeSheetService = require("../services/humanforce/timesheet.service");
const createMYOBTimeSheetService = require("../services/myob/timesheet.service");
const createBaseFactory = require("./base.factory");

function createThirdPartyTimeSheetFactory(strategy) {
  const mappings = new Map([
    ["HumanForceStrategy", createHumanForceTimeSheetService],
    ["MYOBStrategy", createMYOBTimeSheetService],
    ["EHStrategy", createEHTimeSheetService],
  ]);

  const factory = createBaseFactory(strategy, mappings);
  factory.dispatchService();

  return new Proxy(factory, {
    get(target, prop) {
      return target[prop];
    }
  });
}

module.exports = createThirdPartyTimeSheetFactory;
