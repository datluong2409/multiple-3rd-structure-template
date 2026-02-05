const ThirdPartyTimeSheetFactory = require("./factories/timesheet.factory");
const EHStrategy = require("./strategies/eh.strategy");
const HumanForceStrategy = require("./strategies/humanforce.strategy");
const MYOBStrategy = require("./strategies/myob.strategy");

async function demoHumanForce() {
    const factory = new ThirdPartyTimeSheetFactory(new HumanForceStrategy());
    const service = factory.service;

    const timesheet = await service.get(1);
    console.log('\n✓ Result:', JSON.stringify(timesheet, null, 2));
}

async function demoMYOB() {
    const factory = new ThirdPartyTimeSheetFactory(new MYOBStrategy());
    const service = factory.service;

    const timesheet = await service.get(1);
    console.log('\n✓ Result:', JSON.stringify(timesheet, null, 2));
}

async function demoEH() {
    const factory = new ThirdPartyTimeSheetFactory(new EHStrategy());
    const service = factory.service;

    const timesheet = await service.get(1);
    console.log('\n✓ Result:', JSON.stringify(timesheet, null, 2));
}


// Run all demos
async function main() {
      await demoHumanForce();
      await demoMYOB();
      await demoEH();
}

main().catch(err => {
    console.error('Error:', err.message);
    console.error(err.stack);
});