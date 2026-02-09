const { runWithConfig, createDefaultConfig } = require('./src/config');
const ThirdPartyService = require('./src/application/third-party.service');

/**
 * Demo: HumanForce Provider
 */
async function demoHumanForce() {
  try {
    const timesheetService = ThirdPartyService.createTimeSheetServiceInstance('humanforce');
    
    // Get timesheet
    const timesheet = await timesheetService.getById(1);
    console.log(timesheet);
    
    
  } catch (error) {
    console.log(error);
    
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    // Create default config
    const config = createDefaultConfig();
    
    // Run demos within config context
    await runWithConfig(config, async () => {
    //   await demoEmploymentHero();
      await demoHumanForce();
    //   await demoMYOB();
    });
  } catch (error) {
   console.log(error);
   
    process.exit(1);
  }
}

// Run the application
main();