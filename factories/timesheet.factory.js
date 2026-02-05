const EHTimeSheetService = require("../services/employment-hero/timesheet.service");
const HumanForceTimeSheetService = require("../services/humanforce/timesheet.service");
const MYOBTimeSheetService = require("../services/myob/timesheet.service");
const EHStrategy = require("../strategies/eh.strategy");
const HumanForceStrategy = require("../strategies/humanforce.strategy");
const MYOBStrategy = require("../strategies/myob.strategy");
const BaseFactory = require("./base.factory");

class ThirdPartyTimeSheetFactory extends BaseFactory {
  /**
   * @type {HumanForceTimeSheetService | MYOBTimeSheetService | EHTimeSheetService}
   */
  service = null;

  constructor(strategy) {
    super(strategy);

    this.setMappings(
      new Map([
        [HumanForceStrategy, HumanForceTimeSheetService],
        [MYOBStrategy, MYOBTimeSheetService],
        [EHStrategy, EHTimeSheetService],
      ]),
    );

    this.dispatchService();
  }
}

module.exports = ThirdPartyTimeSheetFactory;
