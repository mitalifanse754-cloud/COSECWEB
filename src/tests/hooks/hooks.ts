import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, firefox, webkit } from '@playwright/test';
setDefaultTimeout(50000)
Before(async function () {
    const browserName = process.env.BROWSER || 'chromium';
    console.log(`Running test on: ${browserName}`);
    if (browserName === 'chromium') {
        this.browser = await chromium.launch({
            headless: false,
            args: ['--start-maximized']
        });
    }
    else if (browserName === 'firefox') {
        this.browser = await firefox.launch({
            headless: false,
            args: ['--start-maximized']
        });
    }
    else if (browserName === 'webkit') {
        this.browser = await webkit.launch({
            headless: false,
            args: ['--start-maximized']
        });
    }

    else { throw new Error(`Unsupported browser: ${browserName}`); }

    if (browserName === 'firefox' || browserName === 'webkit') {
        this.context = await this.browser.newContext({
            ignoreHTTPSErrors: true,
            viewport: { width: 1920, height: 1080 }

        });
    }
    else {
        this.context = await this.browser.newContext({
            ignoreHTTPSErrors: true,
            viewport: null,

        });
    }
    this.page = await this.context.newPage();
});

After(async function () {

    await this.page.close();
    await this.context.close();
    await this.browser.close();
});
