const container = require('./src/di/container');
const { runWithConfig, createDefaultConfig } = require('./src/config');
const logger = require('./src/shared/logger');

/**
 * Demo: Employment Hero Provider
 */
async function demoEmploymentHero() {
  try {
    logger.info('=== Employment Hero Demo ===');
    const timesheetService = container.resolve('timesheetService');
    
    // Get timesheet
    const timesheet = await timesheetService.getTimesheet('employmentHero', 1);
    logger.info('✓ Timesheet fetched', { timesheet: timesheet.toJSON() });
    
    // List timesheets
    const timesheets = await timesheetService.listTimesheets('employmentHero');
    logger.info('✓ Timesheets listed', { count: timesheets.length });
    
    // Approve timesheet
    const approved = await timesheetService.approveTimesheet('employmentHero', 1);
    logger.info('✓ Timesheet approved', { status: approved.status });
    
  } catch (error) {
    logger.error('Employment Hero demo failed', { error: error.message });
  }
}

/**
 * Demo: HumanForce Provider
 */
async function demoHumanForce() {
  try {
    logger.info('=== HumanForce Demo ===');
    const timesheetService = container.resolve('timesheetService');
    
    // Get timesheet
    const timesheet = await timesheetService.getTimesheet('humanforce', 1);
    logger.info('✓ Timesheet fetched', { timesheet: timesheet.toJSON() });
    
    // Create new timesheet
    const newTimesheet = await timesheetService.createTimesheet('humanforce', {
      employeeId: 'emp-new',
      employeeName: 'New Employee',
      hours: 8,
      status: 'pending',
    });
    logger.info('✓ Timesheet created', { id: newTimesheet.id });
    
  } catch (error) {
    logger.error('HumanForce demo failed', { error: error.message });
  }
}

/**
 * Demo: MYOB Provider
 */
async function demoMYOB() {
  try {
    logger.info('=== MYOB Demo ===');
    const timesheetService = container.resolve('timesheetService');
    
    // Get timesheet
    const timesheet = await timesheetService.getTimesheet('myob', 1);
    logger.info('✓ Timesheet fetched', { timesheet: timesheet.toJSON() });
    
    // Update timesheet
    const updated = await timesheetService.updateTimesheet('myob', 1, {
      hours: 40,
      status: 'updated',
    });
    logger.info('✓ Timesheet updated', { status: updated.status });
    
  } catch (error) {
    logger.error('MYOB demo failed', { error: error.message });
  }
}

/**
 * Main execution
 */
async function main() {
  logger.info('Starting multi-provider timesheet demo...');
  
  try {
    // Create default config
    const config = createDefaultConfig();
    
    // Run demos within config context
    await runWithConfig(config, async () => {
    //   await demoEmploymentHero();
      await demoHumanForce();
    //   await demoMYOB();
    });
    
    logger.info('All demos completed successfully!');
  } catch (error) {
    logger.error('Demo execution failed', { 
      error: error.message,
      stack: error.stack 
    });
    process.exit(1);
  }
}

// Run the application
main();