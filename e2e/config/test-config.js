/**
 * Test Configuration for Playwright MCP Testing Framework
 * Multi-website configuration supporting Royal Caribbean and Newsela
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

// Website configurations
const websiteConfigs = {
  royalcaribbean: {
    name: 'Royal Caribbean',
    type: 'royal-caribbean',
    baseUrl: 'https://www.royalcaribbean.com',
    industry: 'cruise',
    selectors: {
      hero: {
        title: ['h1', '.hero-title', '.banner-title', '.main-title', '[data-testid="hero-title"]'],
        subtitle: ['.hero-subtitle', '.banner-subtitle', '.hero p', '.main-subtitle'],
        cta: ['.hero .btn', '.cta-button', '.book-now', '.find-cruise', '[data-testid="hero-cta"]']
      },
      navigation: {
        menu: ['nav', '.main-navigation', '.header-nav', '[role="navigation"]'],
        menuItems: ['nav a', '.nav-item', '.menu-link', '.navigation a'],
        logo: ['.logo', '.brand-logo', '.rc-logo', '.header-logo']
      },
      content: {
        sections: ['.content-section', '.page-section', 'main section', '.feature'],
        headings: ['h1', 'h2', 'h3', '.heading', '.section-title'],
        paragraphs: ['p', '.text-content', '.description']
      },
      forms: {
        search: ['.search-form', '.cruise-search', '[data-testid="search"]'],
        contact: ['.contact-form', '.inquiry-form', 'form'],
        inputs: ['input', 'select', 'textarea'],
        buttons: ['button', '.btn', '[type="submit"]', '.cta']
      },
      booking: {
        deals: ['.deal-card', '.offer', '.promotion', '.cruise-deal'],
        prices: ['.price', '.cost', '.rate', '[data-testid="price"]'],
        availability: ['.available', '.dates', '.calendar']
      }
    },
    urls: {
      homepage: 'https://www.royalcaribbean.com',
      services: 'https://www.royalcaribbean.com/cruise-ships',
      contact: 'https://www.royalcaribbean.com/customer-service/contact-us',
      about: 'https://www.royalcaribbean.com/experience',
      careers: 'https://www.royalcaribbean.com/careers'
    },
    expected: {
      homepage: 'Royal Caribbean',
      services: 'Services',
      contact: 'Contact',
      about: 'About',
      careers: 'Careers'
    },
    companyInfo: {
      name: 'Royal Caribbean',
      address: 'United States',
      phone: '(555) 123-4567',
      fax: '(555) 123-4567'
    },
    testData: {
      contact: {
        validContact: {
          name: 'John Doe',
          email: 'test@royalcaribbean.com',
          confirmEmail: 'test@royalcaribbean.com',
          message: 'I am interested in your cruise offerings and would like to learn more.'
        }
      }
    }
  },
  
  newsela: {
    name: 'Newsela',
    type: 'newsela',
    baseUrl: 'https://newsela.com',
    industry: 'education',
    selectors: {
      hero: {
        title: ['h1', '.hero-title', '.header-title', '.brand-title', '[data-testid="hero-title"]'],
        subtitle: ['.hero-subtitle', '.header-subtitle', '.hero p', '.tagline'],
        cta: ['.hero .btn', '.cta-button', '.get-started', '.sign-up', '[data-testid="hero-cta"]']
      },
      navigation: {
        menu: ['nav', '.main-navigation', '.header-nav', '[role="navigation"]', '.navbar'],
        menuItems: ['nav a', '.nav-item', '.menu-link', '.navigation a', '.nav-link'],
        logo: ['.logo', '.brand-logo', '.newsela-logo', '.header-logo', '[data-testid="logo"]']
      },
      content: {
        sections: ['.content-section', '.article-section', 'main section', '.feature', '.content-area'],
        headings: ['h1', 'h2', 'h3', '.heading', '.section-title', '.article-title'],
        paragraphs: ['p', '.text-content', '.description', '.article-text']
      },
      forms: {
        search: ['.search-form', '.article-search', '[data-testid="search"]', '.search-input'],
        contact: ['.contact-form', '.support-form', '.help-form', 'form'],
        inputs: ['input', 'select', 'textarea'],
        buttons: ['button', '.btn', '[type="submit"]', '.cta', '.button']
      },
      educational: {
        grades: ['.grade-level', '.grade-filter', '[data-testid="grade"]', '.grade-selector'],
        subjects: ['.subject-filter', '.subject-menu', '[data-testid="subject"]', '.subject-selector'],
        articles: ['.article-card', '.content-card', '.reading-card', '[data-testid="article"]'],
        readingLevels: ['.reading-level', '.lexile-level', '[data-testid="reading-level"]']
      }
    },
    urls: {
      homepage: 'https://newsela.com',
      articles: 'https://newsela.com/subject',
      support: 'https://newsela.com/support',
      about: 'https://newsela.com/about',
      educators: 'https://newsela.com/educators'
    },
    expected: {
      homepage: 'Newsela',
      articles: 'Articles',
      support: 'Support',
      about: 'About',
      educators: 'Educators'
    },
    companyInfo: {
      name: 'Newsela',
      address: 'United States',
      email: 'support@newsela.com'
    },
    testData: {
      contact: {
        validContact: {
          name: 'Test Teacher',
          email: 'teacher@school.edu',
          confirmEmail: 'teacher@school.edu',
          message: 'I am interested in using Newsela for my classroom and would like more information.',
          school: 'Test Elementary School',
          grade: '5'
        }
      },
      educational: {
        gradeLevel: process.env.NEWSELA_GRADE_LEVEL || '5',
        subject: process.env.NEWSELA_SUBJECT || 'Science',
        language: process.env.NEWSELA_LANGUAGE || 'English',
        readingLevel: process.env.NEWSELA_READING_LEVEL || '4'
      }
    }
  }
};

// Get current website configuration
function getCurrentWebsiteConfig() {
  const websiteType = process.env.TARGET_WEBSITE || 'newsela';
  return websiteConfigs[websiteType] || websiteConfigs.newsela;
}

const currentWebsite = getCurrentWebsiteConfig();

export const TestConfig = {
  // Website Configuration - dynamically set based on environment
  website: currentWebsite,
  baseUrl: process.env.BASE_URL || currentWebsite.baseUrl,
  environment: process.env.TEST_ENV || 'production',
  
  // Selectors Configuration - from current website
  selectors: currentWebsite.selectors,
  
  // URLs - from current website  
  urls: currentWebsite.urls,
  
  // Expected values - from current website
  expected: currentWebsite.expected,
  
  // Company info - from current website
  companyInfo: currentWebsite.companyInfo,
  
  // Test data - from current website
  testData: currentWebsite.testData,
  
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
  },
  
  // Utility methods
  getCurrentConfig: () => currentWebsite,
  getWebsiteConfigs: () => websiteConfigs,
  setWebsite: (websiteType) => {
    const newConfig = websiteConfigs[websiteType];
    if (newConfig) {
      Object.assign(TestConfig.website, newConfig);
      Object.assign(TestConfig.selectors, newConfig.selectors);
      Object.assign(TestConfig.urls, newConfig.urls);
      Object.assign(TestConfig.expected, newConfig.expected);
      Object.assign(TestConfig.companyInfo, newConfig.companyInfo);
      Object.assign(TestConfig.testData, newConfig.testData);
      TestConfig.baseUrl = newConfig.baseUrl;
    }
  }
};

// Export website configurations for direct access
export { websiteConfigs };
