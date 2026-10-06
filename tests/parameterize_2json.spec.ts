import {test,expect} from '@playwright/test'
import fs from 'fs';
import { stringify } from 'querystring';

//reading data from json file path 
/* const filepath="testData/data.json"  
const logindata:any=JSON.parse(fs.readFileSync(filepath,"utf-8")) */

//or use JSON data parsing using stringify
const filepath="../testData/data.json" 
const logindata:any=JSON.parse(JSON.stringify(require(filepath)))

for(const data of logindata){
  test(`login user with ${data.id} and ${data.password}`, async ({ page })=> {

    await page.goto("http://192.168.27.135/cosec/login");

    await page.locator('#loginid').fill(data.id);
    await page.locator('#pwd').fill(data.password);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForLoadState('networkidle')
    

    if(data.validation.toLowerCase()==="valid"){
        await expect(page).toHaveTitle(/^welcome\s.+$/i);
    }
    else{
        const errormsg= await page.locator('#ValidationMsg')
        await expect(errormsg).toBeVisible()
    }
  })
  }