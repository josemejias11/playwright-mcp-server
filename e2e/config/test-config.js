/**
 * Core Framework Test Configuration
 * Base configuration for the automated testing framework
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

// Generic website configuration structure
const defaultWebsiteConfig = {
  name: 'Generic Website',
  type: 'generic',
  baseUrl: process.env.BASE_URL || 'https://example.com',
  industry: 'generic'
};

export const TestConfig = {
  // Website Configuration - will be overridden by specific branches
  website: defaultWebsiteConfig,
  baseUrl: process.env.BASE_URL || defaultWebsiteConfig.baseUrl,
  environment: process.env.TEST_ENV || 'production',
  
  // Generic Selectors Configuration - common patterns most websites use
  selectors: {
    hero: {
      title: ['h1', '.hero-title', '.banner-title', '.main-title', '.title'],
      subtitle: ['.hero-subtitle', '.banner-subtitle', '.subtitle', '.tagline'],
      cta: ['.hero .btn', '.cta-button', '.btn-primary', 'button']
    },
    navigation: {
      menu: ['nav', '.navigation', '.nav', '[role="navigation"]'],
      menuItems: ['nav a', '.nav-item', '.menu-link', '.nav-link'],
      logo: ['.logo', '.brand', '.brand-logo', '.header-logo']
    },
    content: {
      sections: ['.content', '.section', 'main section', '.container'],
      headings: ['h1', 'h2', 'h3', '.heading', '.title'],
      paragraphs: ['p', '.text', '.description', '.content']
    },
    forms: {
      search: ['.search-form', '.search', '[data-testid="search"]'],
      contact: ['.contact-form', '.form', 'form'],
      inputs: ['input', 'select', 'textarea'],
      buttons: ['button', '.btn', '[type="submit"]']
    }
  },
  
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
  artifactsPath: join(__dirname, '../../reports/artifacts'),
  reportsPath: join(__dirname, '../../reports/e2e'),
  
  // Performance Thresholds
  performance: {
    pageLoadTime: 5000, // ms
    networkTime: 3000,  // ms
    domContentLoaded: 2000 // ms
  },
  
  // Compliance Requirements (generic)
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
