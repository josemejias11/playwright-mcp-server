/**
 * Professional Test Logger for CaliberFS Framework
 * Provides structured logging with different levels and formatting
 */

export class TestLogger {
  constructor(options = {}) {
    this.logLevel = options.level || 'info';
    this.enableColors = options.colors !== false;
    this.enableTimestamp = options.timestamp !== false;
    this.logHistory = [];
  }

  /**
   * Log levels hierarchy: error > warn > info > debug
   */
  static levels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
  };

  /**
   * Color codes for different log types
   */
  static colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
  };

  /**
   * Format timestamp
   */
  getTimestamp() {
    return new Date().toISOString().replace('T', ' ').slice(0, -5);
  }

  /**
   * Format log message with color and timestamp
   */
  formatMessage(level, message, emoji = '') {
    const timestamp = this.enableTimestamp ? `[${this.getTimestamp()}] ` : '';
    const colorCode = this.enableColors ? TestLogger.colors[this.getColorForLevel(level)] : '';
    const resetCode = this.enableColors ? TestLogger.colors.reset : '';
    const prefix = emoji ? `${emoji} ` : '';
    
    return `${colorCode}${timestamp}${prefix}${level.toUpperCase()}: ${message}${resetCode}`;
  }

  /**
   * Get color for log level
   */
  getColorForLevel(level) {
    switch (level) {
      case 'error': return 'red';
      case 'warn': return 'yellow';
      case 'info': return 'blue';
      case 'debug': return 'cyan';
      case 'success': return 'green';
      default: return 'white';
    }
  }

  /**
   * Check if message should be logged based on level
   */
  shouldLog(level) {
    const currentLevel = TestLogger.levels[this.logLevel] || TestLogger.levels.info;
    const messageLevel = TestLogger.levels[level] || TestLogger.levels.info;
    return messageLevel <= currentLevel;
  }

  /**
   * Store log entry in history
   */
  storeLog(level, message) {
    this.logHistory.push({
      timestamp: new Date().toISOString(),
      level,
      message
    });
  }

  /**
   * Generic log method
   */
  async log(level, message, emoji = '') {
    if (!this.shouldLog(level)) return;
    
    const formattedMessage = this.formatMessage(level, message, emoji);
    console.log(formattedMessage);
    this.storeLog(level, message);
  }

  /**
   * Error logging
   */
  async error(message) {
    await this.log('error', message, '❌');
  }

  /**
   * Warning logging
   */
  async warn(message) {
    await this.log('warn', message, '⚠️');
  }

  /**
   * Info logging
   */
  async info(message) {
    await this.log('info', message, 'ℹ️');
  }

  /**
   * Debug logging
   */
  async debug(message) {
    await this.log('debug', message, '🐛');
  }

  /**
   * Success logging
   */
  async success(message) {
    await this.log('success', message, '✅');
  }

  /**
   * Step logging (for test steps)
   */
  async step(message) {
    await this.log('info', message, '▶️');
  }

  /**
   * Performance logging
   */
  async performance(message, timing) {
    await this.log('info', `${message} (${timing}ms)`, '⚡');
  }

  /**
   * Business validation logging
   */
  async business(message) {
    await this.log('info', message, '💼');
  }

  /**
   * Security logging
   */
  async security(message) {
    await this.log('info', message, '🔒');
  }

  /**
   * Accessibility logging
   */
  async accessibility(message) {
    await this.log('info', message, '♿');
  }

  /**
   * Test suite start
   */
  async suiteStart(suiteName) {
    console.log('\n' + '='.repeat(80));
    await this.log('info', `Starting Test Suite: ${suiteName}`, '🚀');
    console.log('='.repeat(80));
  }

  /**
   * Test suite end
   */
  async suiteEnd(suiteName, summary) {
    console.log('\n' + '='.repeat(80));
    await this.log('info', `Completed Test Suite: ${suiteName}`, '🏁');
    await this.log('info', `Results: ${summary.passed}/${summary.total} passed (${summary.successRate}%)`, '📊');
    console.log('='.repeat(80) + '\n');
  }

  /**
   * Test start
   */
  async testStart(testName) {
    await this.log('info', `Starting test: ${testName}`, '🧪');
  }

  /**
   * Test end
   */
  async testEnd(testName, status, duration) {
    const emoji = status === 'PASSED' ? '✅' : '❌';
    await this.log(status === 'PASSED' ? 'success' : 'error', 
      `${testName} - ${status} (${duration}ms)`, emoji);
  }

  /**
   * Get log history
   */
  getHistory() {
    return this.logHistory;
  }

  /**
   * Clear log history
   */
  clearHistory() {
    this.logHistory = [];
  }

  /**
   * Export logs to file
   */
  async exportLogs(filePath) {
    const fs = await import('fs');
    const logData = {
      timestamp: new Date().toISOString(),
      logs: this.logHistory
    };
    
    try {
      fs.writeFileSync(filePath, JSON.stringify(logData, null, 2));
      await this.log('info', `Logs exported to: ${filePath}`, '📄');
    } catch (error) {
      await this.log('error', `Failed to export logs: ${error.message}`, '❌');
    }
  }
}
