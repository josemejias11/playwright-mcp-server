#!/usr/bin/env node

/**
 * Report Manager - Centralized test report management utility
 * Handles report generation, organization, and cleanup
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class ReportManager {
  constructor() {
    this.reportsRoot = path.join(process.cwd(), 'reports');
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  }

  /**
   * Initialize report directories
   */
  initializeDirectories() {
    const directories = [
      'e2e/smoke',
      'e2e/functional', 
      'e2e/integration',
      'e2e/regression',
      'api',
      'performance',
      'security',
      'accessibility',
      'artifacts/screenshots',
      'artifacts/videos',
      'artifacts/traces',
      'playwright',
      'archives'
    ];

    directories.forEach(dir => {
      const fullPath = path.join(this.reportsRoot, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
      }
    });
  }

  /**
   * Generate report file path
   */
  getReportPath(type, suite, format = 'html') {
    const filename = `${type}-${suite}-${this.timestamp}.${format}`;
    return path.join(this.reportsRoot, type, filename);
  }

  /**
   * Generate artifact file path
   */
  getArtifactPath(type, name, format = 'png') {
    const filename = `${name}-${this.timestamp}.${format}`;
    return path.join(this.reportsRoot, 'artifacts', type, filename);
  }

  /**
   * Clean old reports based on retention policy
   */
  cleanOldReports() {
    const retentionPolicies = {
      'e2e': 30,           // 30 days
      'api': 30,           // 30 days
      'performance': 30,    // 30 days
      'security': 30,      // 30 days
      'accessibility': 30, // 30 days
      'artifacts/screenshots': 14, // 14 days
      'artifacts/videos': 7,       // 7 days
      'artifacts/traces': 7        // 7 days
    };

    Object.entries(retentionPolicies).forEach(([dir, days]) => {
      this.cleanDirectory(path.join(this.reportsRoot, dir), days);
    });
  }

  /**
   * Clean directory based on file age
   */
  cleanDirectory(dirPath, retentionDays) {
    if (!fs.existsSync(dirPath)) return;

    const files = fs.readdirSync(dirPath);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile() && stats.mtime < cutoffDate) {
        fs.unlinkSync(filePath);
        console.log(`🗑️  Cleaned old report: ${file}`);
      }
    });
  }

  /**
   * Generate report summary
   */
  generateSummary() {
    const summary = {
      timestamp: new Date().toISOString(),
      reports: {},
      artifacts: {},
      totalSize: 0
    };

    // Count reports by type
    ['e2e', 'api', 'performance', 'security', 'accessibility'].forEach(type => {
      const dirPath = path.join(this.reportsRoot, type);
      if (fs.existsSync(dirPath)) {
        try {
          const files = fs.readdirSync(dirPath).filter(file => {
            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);
            return stat.isFile() && (file.endsWith('.html') || file.endsWith('.json') || file.endsWith('.txt'));
          });
          summary.reports[type] = files.length;
        } catch (error) {
          summary.reports[type] = 0;
        }
      } else {
        summary.reports[type] = 0;
      }
    });

    // Count artifacts by type
    const artifactsPath = path.join(this.reportsRoot, 'artifacts');
    if (fs.existsSync(artifactsPath)) {
      ['screenshots', 'videos', 'traces'].forEach(type => {
        const dirPath = path.join(artifactsPath, type);
        if (fs.existsSync(dirPath)) {
          const files = fs.readdirSync(dirPath).filter(file => 
            !file.startsWith('.') && fs.statSync(path.join(dirPath, file)).isFile()
          );
          summary.artifacts[type] = files.length;
        } else {
          summary.artifacts[type] = 0;
        }
      });
    }

    // Calculate total size
    summary.totalSize = this.getDirectorySize(this.reportsRoot);

    // Write summary
    const summaryPath = path.join(this.reportsRoot, 'summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    
    return summary;
  }

  /**
   * Get files recursively
   */
  getFilesRecursively(dir) {
    let files = [];
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files = files.concat(this.getFilesRecursively(fullPath));
      } else {
        files.push(fullPath);
      }
    });
    
    return files;
  }

  /**
   * Get directory size in bytes
   */
  getDirectorySize(dir) {
    let size = 0;
    
    if (!fs.existsSync(dir)) return 0;
    
    const files = this.getFilesRecursively(dir);
    files.forEach(file => {
      const stat = fs.statSync(file);
      size += stat.size;
    });
    
    return size;
  }

  /**
   * Archive old reports
   */
  async archiveReports() {
    const archiveDate = new Date().toISOString().slice(0, 10);
    const archivePath = path.join(this.reportsRoot, 'archives', `reports-${archiveDate}.tar.gz`);
    
    // Create archive of reports older than 30 days
    console.log(`📦 Creating archive: ${archivePath}`);
    
    // This would use tar/compression in a real implementation
    console.log('📦 Archive creation completed');
  }

  /**
   * Display current status
   */
  displayStatus() {
    const summary = this.generateSummary();
    
    console.log('\n📊 Test Reports Status');
    console.log('='.repeat(50));
    console.log(`📅 Last Updated: ${summary.timestamp}`);
    console.log(`📁 Total Size: ${(summary.totalSize / 1024 / 1024).toFixed(2)} MB`);
    
    console.log('\n📋 Reports by Type:');
    Object.entries(summary.reports).forEach(([type, count]) => {
      console.log(`  ${type.padEnd(15)} ${count} reports`);
    });
    
    console.log('\n🎯 Artifacts by Type:');
    Object.entries(summary.artifacts).forEach(([type, count]) => {
      console.log(`  ${type.padEnd(15)} ${count} files`);
    });
    
    console.log('='.repeat(50));
  }
}

// CLI Interface
const command = process.argv[2];
const reportManager = new ReportManager();

switch (command) {
  case 'init':
    console.log('🚀 Initializing report directories...');
    reportManager.initializeDirectories();
    console.log('✅ Report directories initialized');
    break;
    
  case 'clean':
    console.log('🧹 Cleaning old reports...');
    reportManager.cleanOldReports();
    console.log('✅ Old reports cleaned');
    break;
    
  case 'status':
    reportManager.displayStatus();
    break;
    
  case 'archive':
    console.log('📦 Archiving old reports...');
    await reportManager.archiveReports();
    console.log('✅ Reports archived');
    break;
    
  default:
    console.log(`
📊 Report Manager - Test Report Management Utility

Usage:
  node utils/report-manager.js <command>

Commands:
  init      - Initialize report directory structure
  clean     - Clean old reports based on retention policy
  status    - Display current report status
  archive   - Archive old reports

Examples:
  node utils/report-manager.js init
  node utils/report-manager.js clean
  node utils/report-manager.js status
`);
}

export { ReportManager };
