import { test, expect } from '@playwright/test'
import fs from 'fs';
import * as XLSX from 'xlsx'

//Install Excel(xlsx) for reading xlsx file using cmd- npm install xlsx  
//reading data from XLSX file path follow this: filepath-> Workbook -> Worksheet -> Row & column value
const filepathxlsx = "testData/loginuserdata.xlsx"

const workbook= XLSX.readFile(filepathxlsx)
              
const sheetname= workbook.SheetNames[0] // from workbook get sheet name of < i.e first sheet>
const Worksheet= workbook.Sheets[sheetname] // from obtained sheet name goto worksheet

// now convert Worksheet in JSON
const recordsfromxlsxsheet:any[]= XLSX.utils.sheet_to_json(Worksheet) // JSON data store data in form of array

for (const data of recordsfromxlsxsheet) {
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