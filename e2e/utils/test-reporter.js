/**
 * Professional Test Reporter for Playwright MCP Framework
 * Generates comprehensive HTML and JSON reports
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';

export class TestReporter {
  constructor(options = {}) {
    this.options = {
      outputDir: options.outputDir || 'e2e/reports',
      includeScreenshots: options.includeScreenshots !== false,
      includePerformance: options.includePerformance !== false,
      ...options
    };
    
    // Ensure reports directory exists
    if (!existsSync(this.options.outputDir)) {
      mkdirSync(this.options.outputDir, { recursive: true });
    }
  }

  /**
   * Generate comprehensive test report
   */
  async generateReport(data) {
    const reportData = this.prepareReportData(data);
    
    // Generate different report formats
    await this.generateHTMLReport(reportData);
    await this.generateJSONReport(reportData);
    await this.generateSummaryReport(reportData);
    
    console.log(`\nReports generated in: ${this.options.outputDir}`);
  }

  /**
   * Prepare report data with analytics
   */
  prepareReportData(data) {
    const { results, suiteName, totalDuration, timestamp } = data;
    
    const analytics = this.calculateAnalytics(results);
    const performance = this.calculatePerformanceMetrics(results);
    
    return {
      meta: {
        suiteName,
        timestamp,
        totalDuration,
        framework: 'Playwright MCP Professional Testing Framework v1.0',
        environment: process.env.TEST_ENV || 'production',
        browser: 'chromium',
        url: 'https://www.ifsight.com/'
      },
      analytics,
      performance,
      results,
      raw: data
    };
  }

  /**
   * Calculate test analytics
   */
  calculateAnalytics(results) {
    const total = results.length;
    const passed = results.filter(r => r.status === 'PASSED').length;
    const failed = results.filter(r => r.status === 'FAILED').length;
    const avgDuration = total > 0 ? results.reduce((sum, r) => sum + r.duration, 0) / total : 0;
    
    const categories = results.reduce((acc, result) => {
      acc[result.status] = (acc[result.status] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      passed,
      failed,
      successRate: total > 0 ? ((passed / total) * 100).toFixed(2) : 0,
      avgDuration: Math.round(avgDuration),
      categories,
      trends: this.calculateTrends(results)
    };
  }

  /**
   * Calculate performance metrics
   */
  calculatePerformanceMetrics(results) {
    const durations = results.map(r => r.duration);
    
    return {
      fastest: Math.min(...durations),
      slowest: Math.max(...durations),
      median: this.calculateMedian(durations),
      percentile95: this.calculatePercentile(durations, 95)
    };
  }

  /**
   * Calculate trends and patterns
   */
  calculateTrends(results) {
    const timePattern = results.reduce((acc, result) => {
      const hour = new Date(result.timestamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    const errorPatterns = results
      .filter(r => r.status === 'FAILED')
      .reduce((acc, result) => {
        const errorType = this.categorizeError(result.error);
        acc[errorType] = (acc[errorType] || 0) + 1;
        return acc;
      }, {});

    return {
      timePattern,
      errorPatterns,
      reliability: this.calculateReliability(results)
    };
  }

  /**
   * Categorize error types
   */
  categorizeError(error) {
    if (!error) return 'unknown';
    if (error.includes('timeout')) return 'timeout';
    if (error.includes('network')) return 'network';
    if (error.includes('element')) return 'element';
    if (error.includes('validation')) return 'validation';
    return 'other';
  }

  /**
   * Calculate test reliability score
   */
  calculateReliability(results) {
    const recent = results.slice(-10); // Last 10 tests
    const recentSuccess = recent.filter(r => r.status === 'PASSED').length;
    return recent.length > 0 ? ((recentSuccess / recent.length) * 100).toFixed(1) : 100;
  }

  /**
   * Generate HTML report
   */
  async generateHTMLReport(data) {
    const html = this.generateHTMLTemplate(data);
    const filePath = join(this.options.outputDir, `report-${Date.now()}.html`);
    
    writeFileSync(filePath, html);
    console.log(`HTML Report: ${filePath}`);
  }

  /**
   * Generate HTML template
   */
  generateHTMLTemplate(data) {
    const { meta, analytics, performance, results } = data;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Report - ${meta.suiteName}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { border-bottom: 3px solid #2c5aa0; padding-bottom: 20px; margin-bottom: 30px; }
        .title { color: #2c5aa0; margin: 0; font-size: 2.5em; font-weight: 300; }
        .subtitle { color: #666; margin: 10px 0 0 0; font-size: 1.1em; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
        .metric { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .metric-value { font-size: 2.5em; font-weight: bold; margin-bottom: 5px; }
        .metric-label { font-size: 0.9em; opacity: 0.9; }
        .section { margin: 40px 0; }
        .section-title { color: #2c5aa0; font-size: 1.5em; margin-bottom: 20px; border-left: 4px solid #2c5aa0; padding-left: 15px; }
        .test-grid { display: grid; gap: 15px; }
        .test-item { border: 1px solid #ddd; border-radius: 6px; padding: 15px; background: #fafafa; }
        .test-passed { border-left: 4px solid #28a745; }
        .test-failed { border-left: 4px solid #dc3545; }
        .test-name { font-weight: bold; margin-bottom: 5px; }
        .test-meta { font-size: 0.9em; color: #666; }
        .status-passed { color: #28a745; font-weight: bold; }
        .status-failed { color: #dc3545; font-weight: bold; }
        .error { background: #f8d7da; color: #721c24; padding: 10px; border-radius: 4px; margin-top: 10px; font-family: monospace; font-size: 0.9em; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; color: #666; text-align: center; }
        .performance-bar { background: #e9ecef; height: 20px; border-radius: 10px; overflow: hidden; margin: 5px 0; }
        .performance-fill { height: 100%; background: linear-gradient(90deg, #28a745, #ffc107, #dc3545); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">Test Report</h1>
            <p class="subtitle">${meta.suiteName} • ${new Date(meta.timestamp).toLocaleString()}</p>
        </div>

        <div class="metrics">
            <div class="metric">
                <div class="metric-value">${analytics.total}</div>
                <div class="metric-label">Total Tests</div>
            </div>
            <div class="metric">
                <div class="metric-value">${analytics.passed}</div>
                <div class="metric-label">Passed</div>
            </div>
            <div class="metric">
                <div class="metric-value">${analytics.failed}</div>
                <div class="metric-label">Failed</div>
            </div>
            <div class="metric">
                <div class="metric-value">${analytics.successRate}%</div>
                <div class="metric-label">Success Rate</div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Performance Metrics</h2>
            <p><strong>Fastest Test:</strong> ${performance.fastest}ms</p>
            <p><strong>Slowest Test:</strong> ${performance.slowest}ms</p>
            <p><strong>Median Duration:</strong> ${performance.median}ms</p>
            <p><strong>95th Percentile:</strong> ${performance.percentile95}ms</p>
        </div>

        <div class="section">
            <h2 class="section-title">Test Results</h2>
            <div class="test-grid">
                ${results.map(test => `
                    <div class="test-item ${test.status === 'PASSED' ? 'test-passed' : 'test-failed'}">
                        <div class="test-name">${test.name}</div>
                        <div class="test-meta">
                            Status: <span class="status-${test.status.toLowerCase()}">${test.status}</span> • 
                            Duration: ${test.duration}ms • 
                            Time: ${new Date(test.timestamp).toLocaleTimeString()}
                        </div>
                        ${test.error ? `<div class="error">Error: ${test.error}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="footer">
            <p>${meta.framework} • Target: ${meta.url} • Environment: ${meta.environment}</p>
            <p>Report generated on ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Generate JSON report
   */
  async generateJSONReport(data) {
    const filePath = join(this.options.outputDir, `report-${Date.now()}.json`);
    writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`JSON Report: ${filePath}`);
  }

  /**
   * Generate summary report
   */
  async generateSummaryReport(data) {
    const { meta, analytics } = data;
    const summary = `
Test Report Summary
===================
Suite: ${meta.suiteName}
Date: ${new Date(meta.timestamp).toLocaleString()}
Duration: ${meta.totalDuration}ms

Results:
- Total Tests: ${analytics.total}
- Passed: ${analytics.passed}
- Failed: ${analytics.failed}
- Success Rate: ${analytics.successRate}%

Environment: ${meta.environment}
Target: ${meta.url}
Framework: ${meta.framework}
`;

    const filePath = join(this.options.outputDir, `summary-${Date.now()}.txt`);
    writeFileSync(filePath, summary);
    console.log(`Summary Report: ${filePath}`);
  }

  /**
   * Utility functions
   */
  calculateMedian(numbers) {
    const sorted = numbers.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[middle - 1] + sorted[middle]) / 2 
      : sorted[middle];
  }

  calculatePercentile(numbers, percentile) {
    const sorted = numbers.slice().sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }
}
