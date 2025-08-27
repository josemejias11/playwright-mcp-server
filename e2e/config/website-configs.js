/**
 * Website Configuration Registry
 * Centralized configuration for different websites and their specific requirements
 */

export const WebsiteConfigs = {
  royalcaribbean: {
    name: 'Royal Caribbean',
    baseUrl: 'https://www.royalcaribbean.com',
    type: 'cruise-booking',
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
      booking: {
        searchForm: ['.search-form', '.cruise-search', '.booking-form', '[data-testid="search-form"]'],
        destination: ['.destination-select', '#destination', '[name="destination"]'],
        dates: ['.date-picker', '.departure-date', '[name="departureDate"]'],
        guests: ['.guest-select', '.passenger-count', '[name="guests"]'],
        searchButton: ['.search-btn', '.find-cruises', '[type="submit"]', '.search-button']
      },
      content: {
        mainContent: ['main', '.main-content', '.page-content'],
        cruiseCards: ['.cruise-card', '.ship-card', '.offer-card', '.destination-card'],
        deals: ['.deal-card', '.promotion', '.special-offer', '.savings']
      }
    },
    features: ['cruise-search', 'booking-flow', 'destination-browsing', 'deals-promotions']
  }
};

export const getCurrentWebsiteConfig = () => {
  const currentSite = process.env.TARGET_WEBSITE || 'royalcaribbean';
  const config = WebsiteConfigs[currentSite];
  
  if (!config) {
    throw new Error(`Website configuration not found for: ${currentSite}. Available: ${Object.keys(WebsiteConfigs).join(', ')}`);
  }
  
  return config;
};

export const getAllWebsiteConfigs = () => WebsiteConfigs;

export const switchWebsite = (websiteName) => {
  if (!WebsiteConfigs[websiteName]) {
    throw new Error(`Website "${websiteName}" not supported. Available: ${Object.keys(WebsiteConfigs).join(', ')}`);
  }
  
  process.env.TARGET_WEBSITE = websiteName;
  return WebsiteConfigs[websiteName];
};
