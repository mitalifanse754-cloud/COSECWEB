import { test, expect } from '@playwright/test'
import fs from 'fs';
import { parse } from 'csv-parse/sync';

//Install csv-parse for reading csv file using cmd- npm install csv-parse
//reading data from CSV file path 
const filepath = "testData/logindata.csv"
const filecontent = fs.readFileSync(filepath, "utf-8") //take file content in variable
const records: any[]= parse(filecontent, {
                                          columns: true, 
                                          skip_empty_lines: true 
                                        })

for (const data of records) {
  test(`login user with ${data.id} and ${data.password} in cosec using csv`, async ({ page }) => {

    await page.goto("http://192.168.27.135/cosec/login");

    await page.locator('#loginid').fill(data.id);
    await page.locator('#pwd').fill(data.password);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForLoadState('networkidle')


    if (data.validation.toLowerCase() === "valid") {
      await expect(page).toHaveTitle(/^welcome\s.+$/i);
    }
    else {
      const errormsg = await page.locator('#ValidationMsg')
      await expect(errormsg).toBeVisible()
    }
  })
}