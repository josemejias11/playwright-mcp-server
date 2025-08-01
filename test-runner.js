#!/usr/bin/env node

/**
 * Playwright MCP Test Runner
 * 
 * Master test execution script for organized test suites
 * Supports different test levels and execution strategies
 */

import { spawn } from 'child_process';
import { readFileSync } from 'fs';

class TestRunner {
  constructor() {
    this.testResults = [];
    this.startTime = Date.now();
  }

  async runCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      console.log(`\n🚀 Running: ${command} ${args.join(' ')}`);
      
      const child = spawn(command, args, {
        stdio: 'inherit',
        cwd: process.cwd(),
        ...options
      });

      const timeout = options.timeout || 300000; // 5 minutes default
      const timeoutId = setTimeout(() => {
        child.kill('SIGTERM');
        reject(new Error(`Command timed out after ${timeout}ms`));
      }, timeout);

      child.on('close', (code) => {
        clearTimeout(timeoutId);
        if (code === 0) {
          resolve({ success: true, code });
        } else {
          resolve({ success: false, code });
        }
      });

      child.on('error', (error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
    });
  }

  async runTestSuite(suiteName, command, timeout = 300000) {
    const startTime = Date.now();
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🧪 STARTING TEST SUITE: ${suiteName}`);
    console.log(`${'='.repeat(60)}`);

    try {
      const result = await this.runCommand('npm', ['run', command], { timeout });
      const duration = Date.now() - startTime;
      
      this.testResults.push({
        suite: suiteName,
        command,
        success: result.success,
        duration,
        timestamp: new Date().toISOString()
      });

      if (result.success) {
        console.log(`\n✅ ${suiteName} PASSED (${duration}ms)`);
      } else {
        console.log(`\n❌ ${suiteName} FAILED (${duration}ms)`);
      }

      return result.success;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      this.testResults.push({
        suite: suiteName,
        command,
        success: false,
        duration,
        error: error.message,
        timestamp: new Date().toISOString()
      });

      console.log(`\n💥 ${suiteName} ERROR: ${error.message}`);
      return false;
    }
  }

  generateReport() {
    const totalDuration = Date.now() - this.startTime;
    const totalSuites = this.testResults.length;
    const passedSuites = this.testResults.filter(r => r.success).length;
    const failedSuites = totalSuites - passedSuites;

    const report = {
      testRun: {
        timestamp: new Date().toISOString(),
        totalDuration,
        totalSuites,
        passedSuites,
        failedSuites,
        successRate: totalSuites > 0 ? ((passedSuites / totalSuites) * 100).toFixed(2) : 0
      },
      results: this.testResults,
      summary: {
        status: failedSuites === 0 ? 'PASSED' : 'FAILED',
        recommendation: this.getRecommendation(passedSuites, totalSuites)
      }
    };

    return report;
  }

  getRecommendation(passed, total) {
    const rate = (passed / total) * 100;
    if (rate === 100) return 'All tests passed - Ready for deployment';
    if (rate >= 80) return 'Most tests passed - Review failures before deployment';
    if (rate >= 60) return 'Moderate test success - Address failures before deployment';
    return 'High failure rate - Do not deploy until issues are resolved';
  }

  printFinalReport() {
    const report = this.generateReport();
    
    console.log(`\n${'='.repeat(80)}`);
    console.log('📊 FINAL TEST EXECUTION REPORT');
    console.log(`${'='.repeat(80)}`);
    
    console.log(`\n📈 Overall Results:`);
    console.log(`   • Total Suites: ${report.testRun.totalSuites}`);
    console.log(`   • Passed: ${report.testRun.passedSuites} ✅`);
    console.log(`   • Failed: ${report.testRun.failedSuites} ❌`);
    console.log(`   • Success Rate: ${report.testRun.successRate}%`);
    console.log(`   • Total Duration: ${(report.testRun.totalDuration / 1000).toFixed(1)}s`);
    
    console.log(`\n📋 Test Suite Details:`);
    report.results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      const duration = (result.duration / 1000).toFixed(1);
      console.log(`   ${status} ${result.suite} (${duration}s)`);
      if (!result.success && result.error) {
        console.log(`      Error: ${result.error}`);
      }
    });

    console.log(`\n🎯 Recommendation: ${report.summary.recommendation}`);
    console.log(`\n📄 Report Status: ${report.summary.status}`);
    
    return report;
  }
}

// Test execution strategies
const testStrategies = {
  smoke: {
    name: 'Smoke Tests (Critical Path)',
    suites: [
      { name: 'Critical Path Smoke Tests', command: 'test:smoke', timeout: 300000 }
    ],
    description: 'Quick validation of critical functionality'
  },
  
  functional: {
    name: 'Functional Test Suite',
    suites: [
      { name: 'Critical Path Smoke Tests', command: 'test:smoke', timeout: 300000 },
      { name: 'Content Validation Tests', command: 'test:functional', timeout: 900000 }
    ],
    description: 'Business logic and content validation'
  },
  
  quality: {
    name: 'Quality Assurance Suite',
    suites: [
      { name: 'Performance Tests', command: 'test:performance', timeout: 600000 },
      { name: 'Accessibility Tests', command: 'test:accessibility', timeout: 600000 }
    ],
    description: 'Performance and accessibility validation'
  },
  
  security: {
    name: 'Security & Compliance Suite',
    suites: [
      { name: 'Security & Data Protection', command: 'test:security', timeout: 900000 }
    ],
    description: 'Security and regulatory compliance checks'
  },
  
  comprehensive: {
    name: 'Comprehensive Test Suite',
    suites: [
      { name: 'Critical Path Smoke Tests', command: 'test:smoke', timeout: 300000 },
      { name: 'Content Validation Tests', command: 'test:functional', timeout: 900000 },
      { name: 'Performance Tests', command: 'test:performance', timeout: 600000 },
      { name: 'Accessibility Tests', command: 'test:accessibility', timeout: 600000 },
      { name: 'Security & Data Protection', command: 'test:security', timeout: 900000 }
    ],
    description: 'Complete test coverage across all areas'
  }
};

async function main() {
  const args = process.argv.slice(2);
  const strategy = args[0] || 'smoke';
  
  if (!testStrategies[strategy]) {
    console.error('❌ Invalid test strategy. Available strategies:');
    Object.keys(testStrategies).forEach(key => {
      console.error(`   • ${key}: ${testStrategies[key].description}`);
    });
    process.exit(1);
  }

  const runner = new TestRunner();
  const selectedStrategy = testStrategies[strategy];
  
  console.log(`🎯 Test Strategy: ${selectedStrategy.name}`);
  console.log(`📝 Description: ${selectedStrategy.description}`);
  console.log(`🧪 Test Suites: ${selectedStrategy.suites.length}`);
  
  let allPassed = true;
  
  for (const suite of selectedStrategy.suites) {
    const success = await runner.runTestSuite(suite.name, suite.command, suite.timeout);
    if (!success) {
      allPassed = false;
      
      // For smoke tests, stop immediately on failure
      if (strategy === 'smoke') {
        console.log('\n🚨 SMOKE TEST FAILURE - STOPPING EXECUTION');
        break;
      }
    }
  }
  
  const report = runner.printFinalReport();
  
  // Exit with appropriate code
  if (allPassed) {
    console.log('\n🎉 ALL TESTS PASSED');
    process.exit(0);
  } else {
    console.log('\n💥 SOME TESTS FAILED');
    process.exit(1);
  }
}

// Handle command line execution
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('💥 Test runner error:', error);
    process.exit(1);
  });
}
