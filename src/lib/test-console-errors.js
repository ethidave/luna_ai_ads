// Test script to verify console error fixes
// Run this in browser console to test the logging levels

// Test the console manager
import { logger } from './console-utils';

console.log('Testing console error fixes...');

// Test different log levels
logger.error('This should appear as WARN level');
logger.warn('This should appear as WARN level');
logger.info('This should NOT appear (level too low)');
logger.debug('This should NOT appear (level too low)');

// Test silent error logging
logger.silentError('This should not appear in console');

console.log('Console error test completed. Check if only WARN level messages appear.');
