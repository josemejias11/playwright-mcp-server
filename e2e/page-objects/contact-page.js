/**
 * CaliberFS Contact Page Object Model
 * Handles contact form interactions and validations
 */

export class CaliberFSContactPage {
  constructor(mcpClient) {
    this.client = mcpClient;
    this.url = 'https://www.caliberfs.com/contact';
    
    // Selectors based on actual website analysis
    this.selectors = {
      // Page elements
      pageTitle: 'h1, .page-title',
      contactForm: 'form',
      
      // Form fields (based on actual form analysis)
      nameInput: 'input[name="name"], input[id="name"], #name',
      emailInput: 'input[name="Email"], input[id="Email"], #Email',
      confirmEmailInput: 'input[name="Confirm-Email"], input[id="Confirm-Email"], #Confirm-Email',
      messageInput: 'input[name="Message"], textarea[name="Message"], #Message',
      submitButton: 'input[type="submit"], button[type="submit"], .submit-button',
      
      // Validation messages
      successMessage: '.success-message, .thank-you, [class*="success"]',
      errorMessage: '.error-message, .error, [class*="error"]',
      
      // Company information
      companyInfo: '.contact-company-info, .company-info',
      address: '.address, [class*="address"]',
      phone: '[href*="tel"], .phone, [class*="phone"]',
      
      // Additional contact methods
      mediaInquiries: '.media, [class*="media"]'
    };
  }

  /**
   * Navigate to contact page
   */
  async navigate() {
    await this.client.navigateTo(this.url, 'load');
    await this.waitForPageLoad();
  }

  /**
   * Wait for contact page to load
   */
  async waitForPageLoad() {
    await this.client.waitForElement(this.selectors.contactForm, 'visible', 10000);
    
    // Verify page title
    const pageInfo = await this.client.getPageInfo();
    if (!pageInfo.output.includes('Contact')) {
      throw new Error('Contact page did not load correctly - title mismatch');
    }
  }

  /**
   * Fill out contact form
   */
  async fillContactForm(formData) {
    const { name, email, confirmEmail, message } = formData;
    
    // Fill name field
    await this.client.waitForElement(this.selectors.nameInput, 'visible');
    await this.client.fillInput(this.selectors.nameInput, name);
    
    // Fill email field
    await this.client.waitForElement(this.selectors.emailInput, 'visible');
    await this.client.fillInput(this.selectors.emailInput, email);
    
    // Fill confirm email field
    await this.client.waitForElement(this.selectors.confirmEmailInput, 'visible');
    await this.client.fillInput(this.selectors.confirmEmailInput, confirmEmail);
    
    // Fill message field
    await this.client.waitForElement(this.selectors.messageInput, 'visible');
    await this.client.fillInput(this.selectors.messageInput, message);
  }

  /**
   * Submit contact form
   */
  async submitForm() {
    await this.client.waitForElement(this.selectors.submitButton, 'visible');
    await this.client.clickElement(this.selectors.submitButton);
    
    // Wait a moment for form processing
    await this.sleep(2000);
  }

  /**
   * Fill and submit contact form
   */
  async fillAndSubmitForm(formData) {
    await this.fillContactForm(formData);
    await this.submitForm();
  }

  /**
   * Validate form submission success
   */
  async validateFormSuccess() {
    try {
      // Look for success message
      await this.client.waitForElement(this.selectors.successMessage, 'visible', 5000);
      const successText = await this.client.getText(this.selectors.successMessage);
      return {
        success: true,
        message: successText.output
      };
    } catch (error) {
      return {
        success: false,
        error: 'Success message not found'
      };
    }
  }

  /**
   * Validate form submission error
   */
  async validateFormError() {
    try {
      await this.client.waitForElement(this.selectors.errorMessage, 'visible', 5000);
      const errorText = await this.client.getText(this.selectors.errorMessage);
      return {
        hasError: true,
        message: errorText.output
      };
    } catch (error) {
      return {
        hasError: false,
        error: 'Error message not found'
      };
    }
  }

  /**
   * Validate form fields are present
   */
  async validateFormStructure() {
    const formValidation = await this.client.evaluateJavaScript(`
      (() => {
        const form = document.querySelector('form');
        if (!form) return { hasForm: false };
        
        const fields = {
          name: !!document.querySelector('input[name="name"], input[id="name"]'),
          email: !!document.querySelector('input[name="Email"], input[id="Email"]'),
          confirmEmail: !!document.querySelector('input[name="Confirm-Email"], input[id="Confirm-Email"]'),
          message: !!document.querySelector('input[name="Message"], textarea[name="Message"], input[id="Message"]'),
          submit: !!document.querySelector('input[type="submit"], button[type="submit"]')
        };
        
        return {
          hasForm: true,
          formAction: form.action,
          formMethod: form.method,
          fields,
          allFieldsPresent: Object.values(fields).every(field => field)
        };
      })()
    `);
    
    return formValidation.output;
  }

  /**
   * Test form validation (empty fields)
   */
  async testEmptyFormValidation() {
    // Try to submit empty form
    await this.submitForm();
    
    // Check for validation messages or required field indicators
    const validationCheck = await this.client.evaluateJavaScript(`
      (() => {
        const form = document.querySelector('form');
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        const validationMessages = document.querySelectorAll('.error, .invalid, [class*="error"]');
        
        return {
          hasRequiredFields: inputs.length > 0,
          requiredFieldCount: inputs.length,
          hasValidationMessages: validationMessages.length > 0,
          validationMessageCount: validationMessages.length
        };
      })()
    `);
    
    return validationCheck.output;
  }

  /**
   * Test email validation
   */
  async testEmailValidation(invalidEmail) {
    // Fill form with invalid email
    await this.fillContactForm({
      name: 'Test User',
      email: invalidEmail,
      confirmEmail: invalidEmail,
      message: 'Test message'
    });
    
    await this.submitForm();
    
    // Check for email validation errors
    return await this.validateFormError();
  }

  /**
   * Test email confirmation validation
   */
  async testEmailConfirmationValidation() {
    // Fill form with mismatched emails
    await this.fillContactForm({
      name: 'Test User',
      email: 'test@example.com',
      confirmEmail: 'different@example.com',
      message: 'Test message'
    });
    
    await this.submitForm();
    
    // Check for email mismatch validation
    return await this.validateFormError();
  }

  /**
   * Get company contact information
   */
  async getCompanyContactInfo() {
    const contactInfo = await this.client.evaluateJavaScript(`
      (() => {
        const bodyText = document.body.textContent;
        
        // Extract address
        const addressMatch = bodyText.match(/1611 S\\. Utica Ave[^\\n]*/);
        const address = addressMatch ? addressMatch[0] : null;
        
        // Extract phone
        const phoneMatch = bodyText.match(/\\(\\d{3}\\)[^\\d]*\\d{3}[^\\d]*\\d{4}/);
        const phone = phoneMatch ? phoneMatch[0] : null;
        
        // Check for email addresses
        const emailMatch = bodyText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/);
        const email = emailMatch ? emailMatch[0] : null;
        
        return {
          address,
          phone,
          email,
          hasContactInfo: !!(address && phone)
        };
      })()
    `);
    
    return contactInfo.output;
  }

  /**
   * Validate company information accuracy
   */
  async validateCompanyInfo() {
    const info = await this.getCompanyContactInfo();
    
    const validation = {
      hasAddress: !!info.address,
      hasPhone: !!info.phone,
      addressCorrect: info.address && info.address.includes('1611 S. Utica Ave'),
      phoneCorrect: info.phone && info.phone.includes('855'),
      locationCorrect: info.address && (info.address.includes('Tulsa') || info.address.includes('OK'))
    };
    
    return {
      ...info,
      validation,
      isValid: validation.hasAddress && validation.hasPhone && validation.addressCorrect
    };
  }

  /**
   * Check for media inquiries section
   */
  async checkMediaInquiries() {
    const mediaSection = await this.client.evaluateJavaScript(`
      (() => {
        const bodyText = document.body.textContent.toLowerCase();
        return {
          hasMediaSection: bodyText.includes('media inquiries') || bodyText.includes('media'),
          hasMediaEmail: bodyText.includes('media') && bodyText.includes('@'),
          content: bodyText.substring(bodyText.indexOf('media'), bodyText.indexOf('media') + 200)
        };
      })()
    `);
    
    return mediaSection.output;
  }

  /**
   * Test form security measures
   */
  async checkFormSecurity() {
    const securityCheck = await this.client.evaluateJavaScript(`
      (() => {
        const form = document.querySelector('form');
        const isHTTPS = location.protocol === 'https:';
        const hasCSRF = !!document.querySelector('input[name*="csrf"], input[name*="token"]');
        const formAction = form ? form.action : '';
        const isSecureAction = formAction.startsWith('https://');
        
        return {
          isHTTPS,
          hasCSRF,
          isSecureAction,
          formAction,
          securityScore: [isHTTPS, isSecureAction].filter(Boolean).length
        };
      })()
    `);
    
    return securityCheck.output;
  }

  /**
   * Capture contact page screenshot
   */
  async captureScreenshot(filename = 'contact-page') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const path = `e2e/artifacts/${filename}-${timestamp}.png`;
    await this.client.takeScreenshot(path, true);
    return path;
  }

  /**
   * Utility sleep function
   */
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
