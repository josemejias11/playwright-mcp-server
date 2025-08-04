/**
 * Test Configuration for Playwright MCP Testing Framework
 * Centralized configuration for professional testing standards
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

export const TestConfig = {
  // Environment Configuration
  baseUrl: process.env.BASE_URL || 'https://applaudo.com/en/',
  environment: process.env.TEST_ENV || 'production',
  
  // Browser Configuration
  headless: process.env.HEADLESS === 'true' || false,
  defaultBrowser: 'chromium',
  viewport: {
    width: 1280,
    height: 720
  },
  
  // Timeout Configuration
  defaultTimeout: 15000,
  shortTimeout: 5000,
  longTimeout: 60000,
  
  // Framework Paths
  serverPath: join(__dirname, '../../build/index.js'),
  artifactsPath: join(__dirname, '../artifacts'),
  reportsPath: join(__dirname, '../reports'),
  
  // Test Data
  urls: {
    homepage: 'https://applaudo.com/en/',
    services: 'https://applaudo.com/en/services/',
    contact: 'https://applaudo.com/en/contact/',
    about: 'https://applaudo.com/en/about/',
    careers: 'https://applaudo.com/en/careers/'
  },
  
  // Expected Page Titles
  expectedTitles: {
    homepage: 'Applaudo Studios',
    services: 'Services',
    contact: 'Contact',
    about: 'About',
    careers: 'Careers'
  },
  
  // Company Information (for validation)
  companyInfo: {
    name: 'Applaudo Studios',
    address: 'San Salvador, El Salvador',
    phone: '(503) 2505-7000',
    fax: '(503) 2505-7000'
  },
  
  // Test Data for Forms
  testData: {
    contact: {
      validContact: {
        name: 'John Doe',
        email: 'john.doe@applaudo.com',
        confirmEmail: 'john.doe@applaudo.com',
        message: 'I am interested in your software development services and would like to learn more about your offerings.'
      },
      invalidContact: {
        name: '',
        email: 'invalid-email',
        confirmEmail: 'different@email.com',
        message: ''
      }
    }
  },
  
  // Performance Thresholds
  performance: {
    pageLoadTime: 5000, // ms
    networkTime: 3000,  // ms
    domContentLoaded: 2000 // ms
  },
  
  // Financial Services Compliance Requirements
  compliance: {
    requireHttps: true,
    requiredHeaders: ['X-Frame-Options', 'X-Content-Type-Options'],
    privacyPolicyRequired: true,
    termsOfServiceRequired: true
  },
  
  // Accessibility Standards
  accessibility: {
    checkColorContrast: true,
    checkKeyboardNavigation: true,
    requireAltText: true,
    checkAriaLabels: true
  },
  
  // Mobile Testing
  mobile: {
    devices: ['iPhone 12', 'Samsung Galaxy S21', 'iPad'],
    viewports: [
      { width: 375, height: 667 }, // iPhone SE
      { width: 390, height: 844 }, // iPhone 12
      { width: 768, height: 1024 } // iPad
    ]
  },
  
  // Retry Configuration
  retries: {
    defaultRetries: 2,
    flakyTestRetries: 3,
    networkRetries: 5
  },
  
  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableScreenshots: true,
    enableVideoRecording: false,
    enableNetworkLogs: true
  },
  
  // Test Categories
  testCategories: {
    smoke: ['homepage-load', 'navigation', 'critical-paths'],
    regression: ['all-pages', 'forms', 'performance'],
    e2e: ['user-journeys', 'business-workflows'],
    performance: ['load-times', 'network-analysis'],
    security: ['https-validation', 'headers-check'],
    accessibility: ['a11y-compliance', 'keyboard-navigation']
  }
};
