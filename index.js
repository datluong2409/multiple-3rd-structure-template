const createThirdPartyTimeSheetFactory = require("./factories/timesheet.factory");
const createEHStrategy = require("./strategies/eh.strategy");
const createHumanForceStrategy = require("./strategies/humanforce.strategy");
const createMYOBStrategy = require("./strategies/myob.strategy");

async function demoHumanForce() {
    const strategy = createHumanForceStrategy();
    const factory = createThirdPartyTimeSheetFactory(strategy);
    const service = factory.service;

    const timesheet = await service.get(1);
    console.log('\n✓ Result:', JSON.stringify(timesheet, null, 2));
}

async function demoMYOB() {
    const strategy = createMYOBStrategy();
    const factory = createThirdPartyTimeSheetFactory(strategy);
    const service = factory.service;

    const timesheet = await service.get(1);
    console.log('\n✓ Result:', JSON.stringify(timesheet, null, 2));
}

async function demoEH() {
    const strategy = createEHStrategy();
    const factory = createThirdPartyTimeSheetFactory(strategy);
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