/**
 * Homepage Page Object Factory
 * Dynamically creates the appropriate homepage object based on website configuration
 */

import { TestConfig } from '../config/test-config.js';
import { RoyalCaribbeanHomePage } from './royal-caribbean-homepage.js';
import { BasePage } from './base-page.js';

/**
 * Homepage Factory - creates appropriate homepage object based on current website
 */
export function createHomePage(client) {
  const websiteType = TestConfig.website.type;
  
  switch (websiteType) {
    case 'cruise-booking':
      return new RoyalCaribbeanHomePage(client);
    default:
      console.warn(`Unknown website type: ${websiteType}, using base page`);
      return new BasePage(client);
  }
}
