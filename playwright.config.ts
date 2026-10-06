import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  /*Retry failed tests only when running in CI (Continuous Integration) 
  i.e CI server (Azure DevOps, GitHub Actions, Jenkins, etc.), but don't retry when running locally*/
  retries: process.env.CI ? 2 : 0, 
  /* grep: /@sanity/,
  grepInvert:/@regression/, // To run test based on tags*/
  
  // To retries locally use directly number - retries: 2,
  
  /* Opt out of parallel tests on CI. */
  //workers: process.env.CI ? 1 : undefined,
  workers:3,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  //reporter: 'html', //You can pass options to the reporter in a tuple like ['json', { outputFile: './report.json' }]
 // reporter:[['html',{open:'always',outputFolder:'html-report'}],['list'],['line'],['dot'],['junit',{outputFolder:'result.xml'}]], // To Generate html report in specific folder
  /// To generate report through cmd-  npx playwright test tests/parameterize_3csv.spec.ts --reporter=[['html',{open:'always','outputFolder':'html-report'}]] 


  //*****************Allure report***************** */
  //To generate allure report install- 'npm install -D allure-playwright'
//then   add below configuration
 reporter:[['allure-playwright']],
 //to view test report install - 'npm install -g allure-commandline --save-dev'
 // To generate and open the allure report cmd- 'allure generate ./allure-results -o ./allure-report' --clean (clean previous report and genarate new )
 // To Open the generated allure report- 'allure open ./allure-report'

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  timeout: 50000,
  expect:
  {
    timeout: 50000,
  },
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://192.168.27.135/cosec/login',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace:'retain-on-failure',
    headless: false,
    ignoreHTTPSErrors: true,
    acceptDownloads: true,
    // viewport: null, // very important // disable default fixed viewport
    // launchOptions: {args: ['--start-maximized']}
    // this will only fix the window size --->viewport: { width: 1920, height: 1085 }, 
    screenshot:'only-on-failure', //deafult path to store SS is under Test-Results folder if Screenshot path not mentioned in code
    video:'retain-on-failure',
    
  
  },

  /* Configure projects for major browsers */
  projects: [
    {
     name: 'chromium',
      use: {
        //...devices['Desktop Chrome'] , commented this beacuse this conflict with the device scale factor with 'view port: null '

        browserName: 'chromium',
        viewport: null,
        launchOptions: { args: ['--start-maximized'], 
          // slowMo:1000 /*slow motion (slowMo) adds a delay between browser actions. 
          // It is mainly useful when you want to watch the test execution step-by-step while debugging.
         }

      },
    },

/*     {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
 */
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
