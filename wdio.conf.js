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
    
    services: ['chromedriver'],
    
    framework: 'mocha',
    reporters: ['spec'],
    
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
}
