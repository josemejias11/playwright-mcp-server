# 📮 CaliberFS Postman API Testing Suite

## 🎯 **Overview**

This Postman collection provides comprehensive API testing for the CaliberFS website, complementing our Playwright browser automation tests with server-side validation, performance monitoring, and security checks.

## 📋 **Test Coverage**

### 🌐 **Website Health & Performance Tests (5 tests)**
- **Homepage Availability** - Basic availability and branding validation
- **About Page Accessibility** - Corporate information and tribal connection verification
- **Services Page Validation** - Service offerings and content verification
- **Contact Page Form Validation** - Contact form structure and information verification
- **Careers Page Validation** - Career content and accessibility validation

### 🔒 **Security & Performance Tests (3 tests)**
- **SSL Certificate Validation** - HTTPS enforcement and secure connections
- **Security Headers Check** - Content security and caching headers validation
- **Performance Baseline** - Response time, size, and compression validation

### 📝 **Contact Form API Tests (2 tests)**
- **Contact Form GET Request** - Form structure and accessibility verification
- **Contact Form Validation Test** - Parameter handling and error validation

### 🔍 **SEO & Metadata Tests (3 tests)**
- **Homepage SEO Validation** - Title tags, meta descriptions, and heading structure
- **Sitemap Accessibility** - XML sitemap validation and structure
- **Robots.txt Validation** - SEO directives and crawler instructions

### 📱 **Cross-Browser & Device Testing (2 tests)**
- **Mobile User Agent Test** - Mobile responsiveness and viewport validation
- **Desktop Chrome Simulation** - Desktop experience and performance validation

## 🚀 **Quick Start**

### **Prerequisites**
- Postman Desktop App or Postman Web
- Internet connection to reach CaliberFS website

### **Setup Instructions**

1. **Import Collection**
   ```bash
   # In Postman, click Import > File
   # Select: CaliberFS-API-Tests.postman_collection.json
   ```

2. **Import Environment**
   ```bash
   # In Postman, click Import > File  
   # Select: CaliberFS-Environment.postman_environment.json
   # Set as Active Environment
   ```

3. **Run Tests**
   ```bash
   # Option 1: Run entire collection
   # Click "Run Collection" button
   
   # Option 2: Run specific folder
   # Right-click folder > Run Collection
   
   # Option 3: Run individual test
   # Click individual request > Send
   ```

## 📊 **Test Categories Explained**

### **🌐 Website Health Tests**
Validate that all main pages are accessible, load correctly, and contain expected content:
- HTTP status codes (200 OK)
- Response times (< 3 seconds)
- Core content presence
- Basic HTML structure validation

### **🔒 Security & Performance**
Ensure the website follows security best practices and performs well:
- HTTPS enforcement
- Security headers (X-Content-Type-Options, etc.)
- Response compression (gzip/br)
- Response size optimization

### **📝 Contact Form Testing**
Validate the contact form functionality without actually submitting:
- Form structure validation
- Input field presence
- Parameter handling
- Error handling validation

### **🔍 SEO & Metadata**
Check search engine optimization and metadata:
- Title tag optimization
- Meta descriptions
- Viewport configuration
- Heading structure (H1, H2, etc.)
- Sitemap.xml and robots.txt

### **📱 Cross-Browser Testing**
Simulate different devices and browsers:
- Mobile user agent simulation
- Desktop browser simulation
- Responsive design validation

## 🔧 **Configuration**

### **Environment Variables**
- `baseUrl`: https://www.caliberfs.com
- `userAgent`: CaliberFS-API-Tests/1.0
- `timeout`: 5000ms
- `testEmail`: test@caliberfs-qa.com
- `timestamp`: Dynamic timestamp

### **Global Scripts**
- **Pre-request Script**: Sets timestamp for all requests
- **Test Script**: Validates response codes and logs performance

## 📈 **Expected Results**

### **Success Criteria**
- ✅ All pages return 200 status codes
- ✅ Response times under 5 seconds
- ✅ Core content present on all pages
- ✅ Security headers properly configured
- ✅ SEO metadata present
- ✅ Form structure valid

### **Performance Benchmarks**
- Homepage: < 3 seconds response time
- All pages: < 5 seconds response time
- Response size: < 1MB per page
- Compression: gzip/deflate/brotli enabled

## 🔄 **Integration with Existing Framework**

### **Complements Playwright Tests**
- **Postman**: Server-side validation, APIs, performance, security
- **Playwright**: Browser automation, UI interactions, visual validation
- **Combined**: Complete end-to-end testing coverage

### **CI/CD Integration**
```bash
# Run Postman tests in CI/CD pipeline
newman run CaliberFS-API-Tests.postman_collection.json \
  -e CaliberFS-Environment.postman_environment.json \
  --reporters cli,json \
  --reporter-json-export results.json
```

## 🎯 **Business Value**

### **API Testing Benefits**
- **Performance Monitoring** - Track response times and identify slowdowns
- **Security Validation** - Ensure proper security headers and HTTPS
- **SEO Compliance** - Validate metadata and search engine optimization
- **Cross-Device Testing** - Simulate different browsers and devices
- **Uptime Monitoring** - Continuous availability validation

### **Quality Assurance Coverage**
- **Server-Side Testing** - Complement browser automation
- **Performance Baselines** - Establish and monitor performance standards
- **Security Compliance** - Financial services security requirements
- **SEO Optimization** - Search engine visibility validation

## 🔧 **Advanced Usage**

### **Custom Test Scripts**
Each test includes custom JavaScript for:
- Response validation
- Performance monitoring
- Content verification
- Security checks

### **Data-Driven Testing**
Use CSV/JSON files for:
- Multiple test scenarios
- Performance benchmarking
- Cross-environment testing

### **Monitoring & Alerts**
Set up Postman Monitors for:
- Continuous uptime monitoring
- Performance regression detection
- Security compliance monitoring

---

**🎉 The CaliberFS testing framework now includes comprehensive API testing to complement browser automation with server-side validation, performance monitoring, and security checks!**
