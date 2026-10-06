import { test, expect, Locator } from "@playwright/test";

//Demo case for parameterization case- Approach1 -using array
let userdata:string[]=[
    'Mitali','Monika','Mansi'
]

//Enable Attendance calculation flag for all user mentioned in array
//using  for-of loop
for (const user of userdata){
test.skip(`Enable DATD Cal flag for ${user} `, async ({ page })=> {

    await page.goto("http://192.168.27.135/cosec/login");

    await page.locator('#loginid').fill('sa');
    await page.locator('#pwd').fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveTitle(/^welcome\s.+$/i);
     await page.locator('#Link_7').click();
    await page.locator("a[id='7001']").click()
    await expect(page.getByTitle("Photo View")).toBeVisible()
     await expect(page.getByTitle("Photo View")).toBeVisible()
    const searchname = await page.getByPlaceholder('Search')
    searchname.fill(user) //enter first three character only
    searchname.press("Enter")
    await expect(page.getByText("filtered")).toBeVisible()
    const userRow = await page.locator('tr').filter({ has: page.getByText(user, { exact: true }) }).first() //get user row
    await userRow.locator("td").nth(1).click() //Search from Table ,click first column
    await expect(page.locator("[class='form-label label-text control-label mx-input-theme lblRight']").first()).toHaveText(user)

   await page.locator('label:has-text("T&A")').click()

    const atdCalFlg: Locator = await page.getByTitle('Check For Enabling Attendance Calculation')
    if (!await atdCalFlg.isChecked()) {

        atdCalFlg.check()
        }
    })
}

//using  for-each loop
userdata.forEach((user)=> {

    test(`Enable Daily ATD Cal flag for ${user} `, async ({ page })=> {

    await page.goto("http://192.168.27.135/cosec/login");

    await page.locator('#loginid').fill('sa');
    await page.locator('#pwd').fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveTitle(/^welcome\s.+$/i);
     await page.locator('#Link_7').click();
    await page.locator("a[id='7001']").click()
    await expect(page.getByTitle("Photo View")).toBeVisible()
     await expect(page.getByTitle("Photo View")).toBeVisible()
    const searchname = await page.getByPlaceholder('Search')
    searchname.fill(user) //enter first three character only
    searchname.press("Enter")
    await expect(page.getByText("filtered")).toBeVisible()
    const userRow = await page.locator('tr').filter({ has: page.getByText(user, { exact: true }) }).first() //get user row
    await userRow.locator("td").nth(1).click() //Search from Table ,click first column
    await expect(page.locator("[class='form-label label-text control-label mx-input-theme lblRight']").first()).toHaveText(user)

   await page.locator('label:has-text("T&A")').click()

    const atdCalFlg: Locator = await page.getByTitle('Check For Enabling Attendance Calculation')
    if (!await atdCalFlg.isChecked()) {

        atdCalFlg.check()
        }
    })
})
