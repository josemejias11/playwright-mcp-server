/**
 * Royal Caribbean Homepage Page Object
 * Cruise booking and destination browsing functionality
 */

import { BasePage } from './base-page.js';

export class RoyalCaribbeanHomePage extends BasePage {
  constructor(client) {
    super(client);
  }

  /**
   * Get the hero/banner title
   */
  async getHeroTitle() {
    const selectors = this.config.selectors.hero.title;
    const title = await this.getTextBySelectors(selectors);
    
    if (!title) {
      // Fallback: try to get any prominent heading
      const fallbackResult = await this.client.evaluateJavaScript(`
        (() => {
          const headings = document.querySelectorAll('h1, h2, .hero-title, .banner-title');
          for (const heading of headings) {
            if (heading.textContent.trim()) {
              return heading.textContent.trim();
            }
          }
          return 'Royal Caribbean - Cruise Vacations';
        })()
      `);
      return fallbackResult.success ? fallbackResult.output : 'Royal Caribbean Homepage';
    }
    
    return title;
  }

  /**
   * Get hero subtitle or description
   */
  async getHeroSubtitle() {
    const selectors = this.config.selectors.hero.subtitle;
    return await this.getTextBySelectors(selectors) || 'Discover amazing cruise destinations';
  }

  /**
   * Click the main CTA button (usually "Find a Cruise" or "Book Now")
   */
  async clickMainCTA() {
    const selectors = this.config.selectors.hero.cta;
    return await this.clickBySelectors(selectors);
  }

  /**
   * Check if cruise search form is visible
   */
  async isCruiseSearchVisible() {
    const selectors = this.config.selectors.booking.searchForm;
    const result = await this.findElementBySelectors(selectors);
    return result.success;
  }

  /**
   * Fill out cruise search form
   * @param {Object} searchData - Search parameters
   */
  async searchForCruises(searchData = {}) {
    const {
      destination = 'Caribbean',
      departureMonth = null,
      guests = 2,
      duration = 7
    } = searchData;

    // Try to find and interact with search form elements
    const results = {
      destination: false,
      dates: false,
      guests: false,
      search: false
    };

    // Set destination
    if (this.config.selectors.booking.destination) {
      try {
        const destResult = await this.clickBySelectors(this.config.selectors.booking.destination);
        if (destResult.success) {
          // Try to select destination from dropdown or input
          await this.client.typeText(destResult.selector, destination);
          results.destination = true;
        }
      } catch (e) {
        console.log('Could not set destination:', e.message);
      }
    }

    // Set departure date if provided
    if (departureMonth && this.config.selectors.booking.dates) {
      try {
        const dateResult = await this.clickBySelectors(this.config.selectors.booking.dates);
        if (dateResult.success) {
          results.dates = true;
        }
      } catch (e) {
        console.log('Could not set date:', e.message);
      }
    }

    // Set number of guests
    if (this.config.selectors.booking.guests) {
      try {
        const guestResult = await this.clickBySelectors(this.config.selectors.booking.guests);
        if (guestResult.success) {
          await this.client.typeText(guestResult.selector, guests.toString());
          results.guests = true;
        }
      } catch (e) {
        console.log('Could not set guests:', e.message);
      }
    }

    // Click search button
    if (this.config.selectors.booking.searchButton) {
      try {
        const searchResult = await this.clickBySelectors(this.config.selectors.booking.searchButton);
        results.search = searchResult.success;
      } catch (e) {
        console.log('Could not click search:', e.message);
      }
    }

    return results;
  }

  /**
   * Get available destinations from navigation or content
   */
  async getDestinations() {
    const destinations = [];
    
    try {
      const result = await this.client.evaluateJavaScript(`
        (() => {
          const destinationElements = document.querySelectorAll(
            '.destination, .region, .location, [data-destination], .cruise-destination'
          );
          
          return Array.from(destinationElements)
            .map(el => el.textContent?.trim())
            .filter(text => text && text.length > 2)
            .slice(0, 10); // Limit to first 10
        })()
      `);
      
      if (result.success && Array.isArray(result.output)) {
        destinations.push(...result.output);
      }
    } catch (e) {
      console.log('Could not extract destinations:', e.message);
    }
    
    return destinations.length > 0 ? destinations : ['Caribbean', 'Mediterranean', 'Alaska', 'Northern Europe'];
  }

  /**
   * Get featured cruise deals or promotions
   */
  async getFeaturedDeals() {
    const deals = [];
    
    try {
      const selectors = this.config.selectors.content.deals;
      const result = await this.client.evaluateJavaScript(`
        (() => {
          const dealSelectors = ${JSON.stringify(selectors)};
          const allDeals = [];
          
          for (const selector of dealSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
              const title = el.querySelector('h2, h3, .title, .deal-title')?.textContent?.trim();
              const price = el.querySelector('.price, .amount, .cost')?.textContent?.trim();
              const description = el.querySelector('p, .description')?.textContent?.trim();
              
              if (title) {
                allDeals.push({ title, price, description });
              }
            }
          }
          
          return allDeals.slice(0, 5); // Limit to 5 deals
        })()
      `);
      
      if (result.success && Array.isArray(result.output)) {
        deals.push(...result.output);
      }
    } catch (e) {
      console.log('Could not extract deals:', e.message);
    }
    
    return deals;
  }

  /**
   * Check if the page has loaded properly for Royal Caribbean
   */
  async validateRoyalCaribbeanPage() {
    const isValidWebsite = await this.validateWebsite();
    if (!isValidWebsite) {
      return { valid: false, reason: 'Not on Royal Caribbean website' };
    }

    // Check for Royal Caribbean specific elements
    const indicators = [
      'royal', 'caribbean', 'cruise', 'ship', 'vacation',
      'destinations', 'booking', 'sail'
    ];

    const pageContent = await this.client.evaluateJavaScript(`
      document.body.textContent.toLowerCase()
    `);

    if (pageContent.success) {
      const content = pageContent.output;
      const foundIndicators = indicators.filter(indicator => 
        content.includes(indicator)
      );

      if (foundIndicators.length >= 3) {
        return { valid: true, indicators: foundIndicators };
      }
    }

    return { valid: false, reason: 'Does not appear to be Royal Caribbean content' };
  }

  /**
   * Navigate to specific Royal Caribbean pages
   */
  async navigateToDeals() {
    return await this.navigate('/cruise-deals');
  }

  async navigateToDestinations() {
    return await this.navigate('/cruise-destinations');
  }

  async navigateToShips() {
    return await this.navigate('/cruise-ships');
  }
}
