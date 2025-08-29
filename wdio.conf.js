export const config = {
    runner: 'local',
    
    specs: [
        './tests/**/*.spec.js'
    ],
    
    maxInstances: 10,
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: [
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--window-size=1920,1080'
            ]
        },
        acceptInsecureCerts: true
    }],
    
    logLevel: 'info',
    bail: 0,
    baseUrl: 'https://newsela.com',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    
    // Centralize all outputs to reports folder
    outputDir: './reports/wdio',
    
    services: [
        ['chromedriver', {
            outputDir: './reports/chromedriver'
        }]
    ],
    
    framework: 'mocha',
    reporters: [
        'spec',
        ['allure', {
            outputDir: './reports/allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
        }],
        ['json', {
            outputDir: './reports/json',
            outputFileFormat: function(options) {
                return `results-${new Date().toISOString().split('T')[0]}.json`
            }
        }],
        ['junit', {
            outputDir: './reports/junit',
            outputFileFormat: function(options) {
                return `results-${new Date().toISOString().split('T')[0]}.xml`
            }
        }]
    ],
    
    // Screenshot configuration
    screenshotPath: './reports/screenshots',
    
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
}
