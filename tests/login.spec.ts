import { test,expect} from "@playwright/test";

test("Login case",async function ({page}) {
   
    await page.goto("https://192.168.27.135/cosec/login");


    await page.locator('#loginid').fill('sa');
    await page.locator('#pwd').fill('admin');
    //await page.locator('#btnlogin').click();
    await page.getByRole('button', { name: 'Login' }).click();
// To verify Logged in successfully with the user
/*^ → starts with Welcome → static text
\s → one space
.+ → any username (one or more chars)
$ → end of title*/
    await expect(page).toHaveTitle(/^welcome\s.+$/i);
    await page.locator('#Link_1').click();
    await page.waitForTimeout(5000);
    
    await expect(page.locator('.modulename')).toHaveText('Admin');
})
