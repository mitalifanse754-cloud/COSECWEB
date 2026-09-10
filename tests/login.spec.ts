import { test, expect, Locator } from "@playwright/test";
import fs from 'fs'
import * as path from "path";

test.beforeEach("Login case", async function ({ page }) {

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
    /*  await page.locator('#Link_1').click();
     await page.waitForTimeout(5000);
     
     await expect(page.locator('.modulename')).toHaveText('Admin'); */
})

test("Create Leave", async function ({ page }) {
    const LeaveID: string = "CL"
    const LeaveName: string = "CL"
    const LVType: string = "Paid Leave"
    await page.locator('#Link_4').click();
    await page.locator("a[id='4001']").click()
    await expect(await page.locator('div').filter({ hasText: 'Week-Off/Holiday Club-Cover Rule' }).last()).toBeVisible()
    await page.getByPlaceholder('Code').fill(LeaveID)
    await page.getByPlaceholder('Code').press('Tab', { delay: 5000 })
    await page.waitForTimeout(5000);

    const addpopup: boolean = await page.getByRole('button', { name: 'Add' }).isVisible()
    console.log(addpopup)
    if (addpopup === true) {
        await page.locator('[id="mdadd"]').click()
        await expect(page.locator("[id = 'cbolvType']")).toBeVisible()

        await page.getByPlaceholder('Name').click()
        await page.getByPlaceholder('Name').fill(LeaveName)
        const lvtypeDD: Locator = await page.locator('#cbolvType')
        const lvtypeDDEnable: boolean = await lvtypeDD.isEnabled()
        if (lvtypeDDEnable == true) {
            lvtypeDD.selectOption(" Paid Leave ")
        }
        await page.getByPlaceholder('Name').fill(LeaveName)
        await page.getByTitle('Save (Alt+S)').click();
        await expect(page.getByText('Saved Successfully', { exact: true })).toHaveText('Saved Successfully');
    }
    else if (addpopup === false) {
        await page.getByPlaceholder('Name').click()
        await expect(page.getByPlaceholder('Name')).toHaveValue(LeaveName)
        await page.getByTitle('Save (Alt+S)').click();
        await expect(page.getByText('Saved Successfully', { exact: true })).toHaveText('Saved Successfully');
    }
    else {
        console.log(LeaveName, "Not Exist")
    }
})

test('Create user from user configuration page', async function ({ page }) {
    const userID: string = "Mitali"
    const userName: string = "Mitali"
    const DOB: string = "13/7/1994"

    const Birthdate: string[] = DOB.split("/")
    console.log(Birthdate)
    await page.locator('#Link_7').click();
    await page.locator("a[id='7001']").click()
    await expect(page.getByTitle("Photo View")).toBeVisible()
    await page.getByTitle('New (Alt+N)').click();
    await expect(page.getByTitle("Change Photo")).toBeVisible()
    await page.locator("[id='AutoUserID']").click()
    await page.locator("[id='AutoUserID']").fill(userID)
    await page.locator("[id='AutoUserID']").press("Tab")
    await page.locator("[id='AutoUserName']").click()
    await page.locator("[id='AutoUserName']").fill(userName)
    await page.getByRole("link", { name: 'General' }).click()
    await expect(page.getByText("Visa Expiry")).toBeVisible()

    ////-------------------- Date Selection from the calender--------------------------
    await page.locator("//mx-datepicker[@id='TxtBirthDT']//span[@class='input-group-btn clsOutline']//i[@class='fa fa-calendar btn']").click() //click on calender icon
    await expect(page.locator(".dropdown-menu.show")).toBeVisible()
    const calDate: Locator = await page.getByRole("grid")

    //// ------------------Month slection from the Dropdown -Static Dropdown selection----------------
    const calMonth: Locator = await page.getByLabel("Select month")

    const calYear: Locator = await page.getByLabel("Select year")

    calMonth.click()
    calMonth.selectOption(Birthdate[1])
    expect(await calMonth).toHaveValue(Birthdate[1])
    calYear.selectOption(Birthdate[2])

    expect(await calYear).toHaveValue(Birthdate[2])

    const getdates: Locator = calDate.getByRole("gridcell")
    const dates = await getdates.count()
    console.log(dates)
    for (let i = 0; i < dates; i++) {
        let date: string | null = await getdates.nth(i).textContent()

        if (date === Birthdate[0]) {
            getdates.nth(i).click()
            break;
        }
    }


    // Document Upload - Browse file from the computer and upload 

    await page.locator('[id="TxtDRVLIC"]').fill('ABC-123456')
    await page.locator('[name="DrvLicDoc"] a[title="Upload"]').click() //click on Upload icon to open change document Popup 
    const browseicon = page.getByTitle('Browse File')//clcik browse file icon 
    const downloadicon = page.getByTitle('Download File')

    if (await browseicon.isVisible() && await downloadicon.isHidden()) {

        // Start waiting for file chooser before clicking. Note no await.
        const fileChooserPromise = page.waitForEvent('filechooser') // the result is stored in filechooserPromise
        await page.getByTitle('Browse File').click() // after starting wait event click on browse file icon
        const fileChooser = await fileChooserPromise; // wait untill file upload using filechooser
        await fileChooser.setFiles('E:/PlaywrightLearning/COSECWEB/testData/uploadfiles/case1.png')//upload file
        await expect(page.getByTitle('Download File')).toBeVisible() //verify the download file icon is now visible after upload
    }
    else {
        //Download file and store in local 
        console.log("File already uploaded") // file already uploaded so, now verify uploaded file with download
        const downloadFolder = path.join(

            process.cwd(),
            'testData',
            'downloadfiles'
        )
        // Start waiting for download before clicking. Note no await.
        const downloadPromise = page.waitForEvent('download');// the result is stored in downloadPromise
        await page.getByTitle('Download File').click();
        const download = await downloadPromise;

        // Create folder if it doesn't exist
        if (!fs.existsSync(downloadFolder)) { //return true if filepath exist, otherwise crete new folder
            fs.mkdirSync(downloadFolder, { recursive: true });
        }

        // Find next filename
        const existingFiles = fs.readdirSync(downloadFolder);

        let fileName: string;

        if (!existingFiles.includes('Image.png')) { //check if existing file is not there, then create default Image.png

            fileName = 'Image.png';

        } else {

            let number = 1;

            while (existingFiles.includes(`Image(${number}).png`)) {
                number++;
            }

            fileName = `Image(${number}).png`;  //Image(1).png, Image(2).png,...
        }
        const filepath = path.join(
            downloadFolder,
            fileName //use filename instead of suggestedFilename
            // download.suggestedFilename()
        )

        // Wait for the download process to complete and save the downloaded file somewhere.
        //  await download.saveAs('E:/PlaywrightLearning/COSECWEB/testData/downloadfiles/' + download.suggestedFilename());
        await download.saveAs(filepath) // to save file use path with this steps

        console.log("downloaded file:", filepath)
        expect(fs.existsSync(filepath)).toBe(true);
    }




    await page.locator('#btnUpdate').click()
    await expect(page.getByTitle('Browse File')).toBeHidden()

    //await page.pause()
    await page.getByTitle('Save (Alt+S)').click();
    await expect(page.getByText('Saved Successfully', { exact: true })).toHaveText('Saved Successfully');
})

test('delete Driving License uploaded document', async function ({ page }) {
    const userID: string = "Mitali"
    const userName: string = "Mitali"

    await page.locator('#Link_7').click();
    await page.locator("a[id='7001']").click()
    await expect(page.getByTitle("Photo View")).toBeVisible()
    await page.getByTitle('New (Alt+N)').click();
    await expect(page.getByTitle("Change Photo")).toBeVisible()
    await page.locator("[id='AutoUserID']").click()
    await page.locator("[id='AutoUserID']").fill(userID)
    await page.locator("[id='AutoUserID']").press("Tab")
    await page.locator("[id='AutoUserName']").click()
    await page.locator("[id='AutoUserName']").fill(userName)
    await page.getByRole("link", { name: 'General' }).click()
    await expect(page.getByText("Visa Expiry")).toBeVisible()


    if (await page.getByTitle('Preview').nth(0).isVisible()) { // If Preview icon is visible, then uploaded file available i.e delete uploaded file
        await page.locator('[name="DrvLicDoc"] a[title="Upload"]').click() //click on Upload icon to open change document Popup 

        const removeicon = page.getByTitle('Remove File') //delete file icon
        await removeicon.click() // remove uploaded file
        await expect(removeicon).toBeHidden() //verify the file removed
    }
    else { //No document available 
        console.log("No driving license document available for Delete")
    }

})

test('Search User_Dynamic dropdown Search then delete user - Alert concept', async function ({ page }) {
    const userID: string = "Monisha"
    const userName: string = "Monisha"
    const UlistID:string ="Mitali"

    await page.locator('#Link_7').click();
    await page.locator("a[id='7001']").click()
    await expect(page.getByTitle("Photo View")).toBeVisible()
    const searchname = await page.getByPlaceholder('Search')
    searchname.fill(UlistID) //enter first three character only
    searchname.press("Enter")
    await expect(page.getByText("filtered")).toBeVisible()
    const userRow= await page.locator('tr').filter({ has: page.getByText(UlistID,{exact :true})}).first() //get user row
    await userRow.locator("td").nth(1).click() //Search from Table ,click first column
    await expect(page.locator("[class='form-label label-text control-label mx-input-theme lblRight']").first()).toHaveText(UlistID)

    //Search using Dynamic Dropdown
    await page.getByPlaceholder('Search User ID or Name').fill(userID.slice(0,3)) //enter first three character of UserID
    await expect(page.locator('[id="ngb-typeahead-79"]')).toBeVisible()
    const serchDD = page.locator('ngb-highlight:visible')
    await serchDD.filter({ hasText: `${userID} - ${userName}` }).first().click()
    await expect(page.locator("[class='form-label label-text control-label mx-input-theme lblRight']").first()).toHaveText(userID)
    await page.getByTitle('Save (Alt+S)').click();
    await expect(page.getByText('Saved Successfully', { exact: true })).toBeVisible();



    // Alert/ Browser dialog concept -Dialog objects are dispatched by page via the "page.on('dialog') "event.
   
    // Handle browser confirmation dialog
    page.on('dialog', async dialog => {
        console.log("Dialog: ", dialog.message())
        expect(dialog.message()).toBe('Record Will be Deleted. Are You Sure?');
        await dialog.accept()
    })
    await page.getByTitle('Delete (Alt+L)').click(); // Click Delete
        
    await expect(page.getByText('Confirm Delete')).toBeVisible() // Confirm Delete is an in-page dialog/modal
    await page.locator('#btnDeleteOK').click() // Click OK in the Confirm Delete dialog
    await expect(page.getByText('Deleted Successfully', { exact: true })).toBeVisible();// Verify deletion
})