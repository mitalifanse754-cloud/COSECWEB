import { test, expect, Locator } from "@playwright/test";
import fs from 'fs'
import * as path from "path";
import ExcelJS from 'exceljs';
import { setTimeout } from "timers/promises";

test.beforeEach("Login case", async function ({ page }) {

    await page.goto("http://192.168.27.135/cosec/login");


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

test('Search User_Dynamic dropdown Search then delete user - Alert concept, Trace test -through code', async function ({ page, context }) {

    context.tracing.start({ screenshots: true, snapshots: true })// to start Tracing

    const userID: string = "Monisha"
    const userName: string = "Monisha"
    const UlistID: string = "Mitali"

    await page.locator('#Link_7').click();
    await page.locator("a[id='7001']").click()
    await expect(page.getByTitle("Photo View")).toBeVisible()
    const searchname = await page.getByPlaceholder('Search')
    searchname.fill(UlistID) //enter first three character only
    searchname.press("Enter")
    await expect(page.getByText("filtered")).toBeVisible()
    const userRow = await page.locator('tr').filter({ has: page.getByText(UlistID, { exact: true }) }).first() //get user row
    await userRow.locator("td").nth(1).click() //Search from Table ,click first column
    await expect(page.locator("[class='form-label label-text control-label mx-input-theme lblRight']").first()).toHaveText(UlistID)

    //Search using Dynamic Dropdown
    await page.getByPlaceholder('Search User ID or Name').fill(userID.slice(0, 3)) //enter first three character of UserID
    await expect(page.locator('[id="ngb-typeahead-79"]')).toBeVisible()
    const serchDD = page.locator('ngb-highlight:visible')


    //-----------------Stop Tracing ---------------------------
    context.tracing.stop({ path: 'trace.zip' })// to stop Tracing
    await context.close()// to close the context
 /*To open this trace file use cmd--> npx playwright show-trace tracetest.zip 
 or go to URL->'trace.playwright.dev' and then drag & drop the generated file over there to open*/
// for viewing trace file generated through playwright.config.ts setting open html report and then click on generated trace file
////--------------if any line/asserssion failed then trace file will not generated -----//////
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

test('Export User details(working with http)- (Not working with https-Need To Check)', async function ({ page }) { //Failed this test
    const userID: string = "Mitali"
    const givenfilename: string = "userdetails"
    // const UlistID: string = "Mitali"

    await page.locator('#Link_7').click();
    await page.locator("a[id='Exports']").click()
    await page.locator("ul[id='7052']").click()
    const exportButton: Locator = page.locator('input[value="Export"]')
    await expect(exportButton).toBeVisible()
    const formatSelectionDD = await page.locator('#cboFormatSelection')
    formatSelectionDD.selectOption('System Defined')
    await page.locator('#txtFilename').fill(givenfilename)
    const selectUserDD = await page.locator('#grpddl')
    await selectUserDD.selectOption('User Wise')
    await page.getByPlaceholder('ID').fill(userID)
    await page.getByPlaceholder('ID').press("Tab")
    await expect(page.getByText(userID).first()).toBeVisible()


    //declaration of the downloadFolder where downloaded file to be saved 
    const downloadFolder = path.join(

        process.cwd(), //this method returns current working directory of of Node.js process
        'testData',
        'downloadfiles',
        'ExportData'

    )
    // Create folder if it doesn't exist
    //fs stands for File System. It is a built-in Node.js module used to work with files and folders on your computer.
    if (!fs.existsSync(downloadFolder)) { //return true if filepath exist, otherwise crete new folder
        fs.mkdirSync(downloadFolder, { recursive: true }); //(property) recursive: true-->Indicates whether parent folders should be created. 
        //If a folder was created, the path to the first created folder will be returned.
    }
    // Find next filename
    const existingFiles = fs.readdirSync(downloadFolder);

    let fileName: string;

    if (!existingFiles.includes(`${givenfilename}.xlsx`)) { //check if existing file is not there, then create default Image.png

        fileName = `${givenfilename}.xlsx`;

    } else {

        let number = 1;

        while (existingFiles.includes(`${givenfilename} (${number}).xlsx`)) {
            number++;
        }

        fileName = `${givenfilename}(${number}).xlsx`;  //userdetail(1).xlsx, userdetail(2).xlsx,...
    }
    const filepath = path.join(
        downloadFolder,
        fileName //use filename instead of suggestedFilename
        // download.suggestedFilename()
    )
    // Wait for the download process to complete and save the downloaded file somewhere.
    //  await download.saveAs('E:/PlaywrightLearning/COSECWEB/testData/downloadfiles/ExportData' + download.suggestedFilename());

    //Start waiting for download before clicking. Note no await.
    const downloadAwait = page.waitForEvent("download");// the result is stored in downloadPromise
    await page.locator("//input[@value='Export']").click()
    const download = await downloadAwait;  // wait untill file download using download   
    await download.saveAs(filepath)
    //await download.saveAs('E:/PlaywrightLearning/COSECWEB/testData/downloadfiles/ExportData/') // to save file use path with this steps
    console.log("downloaded file:", filepath)
    expect(fs.existsSync(filepath)).toBe(true);  //validate the file exist now at given path or not

})

test(" Frame Haandeling and download wait-User>Reports>User Events Data", async ({ page }) => {
    await page.goto("https://192.168.27.135/cosec/login");

    await page.fill("#loginid", "sa");
    await page.fill("#pwd", "admin");
    await page.click("#btnlogin");

    await expect(page).toHaveTitle("Welcome System Admin", { timeout: 15000 });
    //await page.pause();
    await page.locator("#Link_7").click();
    await page.locator("#Reports").click();
    await page.getByRole("link", { name: "User Events" }).click();
    await page.locator('[id="7040"]').click(); //In-Out Events Report
    await page.waitForLoadState("networkidle"); //Wait for Page Load
    await page.getByPlaceholder("From Date").fill("14/09/2026");
    await page.getByPlaceholder("To Date").fill("15/09/2026");
    await page.locator("#grpddl").selectOption({ label: "All" });
    await page.getByRole("button", { name: "Generate Report" }).click();
    await page.waitForLoadState("networkidle");//Wait till report gets generated
    //Go to the report Frame
    const frame = page.frameLocator("#report1");

    await frame.locator("[aria-label='Export To']").click();
    const downloadwait = page.waitForEvent("download");
    await frame.locator(".dxrd-preview-export-item-text", { hasText: "PDF" }).click();
    const download = await downloadwait;
    await download.saveAs('E:/PlaywrightLearning/COSECWEB/testData/downloadfiles/ExportData/' + download.suggestedFilename());


});

test('Dropdown different cases ', async function ({ page }) {
    const userID: string = "Monisha"
    const userName: string = "Monisha"
    const UlistID: string = "Mitali"

    await page.locator('#Link_7').click();
    await page.locator("a[id='7001']").click()
    await expect(page.getByTitle("Photo View")).toBeVisible()
    const searchname = await page.getByPlaceholder('Search')
    searchname.fill(UlistID) //enter first three character only
    searchname.press("Enter")
    await expect(page.getByText("filtered")).toBeVisible()
    const userRow = await page.locator('tr').filter({ has: page.getByText(UlistID, { exact: true }) }).first() //get user row
    await userRow.locator("td").nth(1).click() //Search from Table ,click first column
    await expect(page.locator("[class='form-label label-text control-label mx-input-theme lblRight']").first()).toHaveText(UlistID)

    await page.locator('label:has-text("T&A")').click()

    const atdCalFlg: Locator = await page.getByTitle('Check For Enabling Attendance Calculation')
    if (!await atdCalFlg.isChecked()) {

        atdCalFlg.check()
    }


    await page.locator('[name="id_150"]').selectOption('Flexible') //select by visible text -Flexible
    await page.locator('[name="id_150"]').selectOption({ value: '4: P' }) //select by value -Present
    await page.locator('[name="id_150"]').selectOption({ index: 1 }) //select by index -Normal
    await page.locator('[name="id_150"]').selectOption({ label: 'Normal' }) //select by label - Executive
    //Display all dropdown values - Find total dropdown values
    const optionlist = await page.locator('select[name="id_150"] option') //get all option elements
    const optionTexts = await optionlist.allInnerTexts()
    console.log(optionTexts)
    console.log(optionTexts.length)

    //Sorting the dropdown values
    const Originallist = [...optionTexts]
    const sortedlist = [...optionTexts.sort()]

    //expect(Originallist).toEqual(sortedlist) //validate through assertion

    //display validation result

    console.log(Originallist == sortedlist ? true : false)

    await page.locator('[name="id_152"]').selectOption('Both')
    const wocheckbox: Locator = await page.getByLabel('WO', { exact: true })
    wocheckbox.check()
    await expect(wocheckbox).toBeChecked()

    //select all checkbox and assert checked
    const autoAuthCoff: string[] = ["WO", "PH", "WO/PH", "FB", "RD", "Normal Day"] // create array of  all checkboxes label
    const checkboxes: Locator[] = await autoAuthCoff.map(index => page.getByLabel(index, { exact: true })) //store locators in array for all checkbox labels
    console.log(checkboxes.length)
    //for-of loop to select all checkbox locators
    for (const checkbox of checkboxes) {
        checkbox.check()
        await expect(checkbox).toBeChecked()
    }

    //uncheck last two checkbox
    for (const checkbox of checkboxes.slice(-2)) {
        checkbox.uncheck()
        await expect(checkbox).not.toBeChecked()
    }
    // check only odd checkboxes
    const oddcheckbox: number[] = [1, 3, 5]
    for (const i of oddcheckbox) {
        checkboxes[i].uncheck()
        await expect(checkboxes[i]).not.toBeChecked()

    }

})

test('Radio button', async function ({ page }) {

    /*     await page.locator('#Link_1').click();
        await page.locator("[id='System Configuration']").click()
        await page.locator("[id='1099']").click() */ //Go to email Configuration tab

    await page.goto('https://192.168.27.135/COSEC/Default/Default#/Menu/1/1099/1099')
    await page.locator('#txtECSmtpSrvr').fill('smtp.gmail.com')
    await page.locator('#txtECSmtpPortSrvr').fill('587')

    //Radio button action
    await page.locator('#txtECPopSrvr').check()//check POP
    await expect(page.locator('#txtECPopSrvr')).toBeChecked() //validate it is checked
    const mailServerselected: boolean = await page.locator('#txtECPopSrvr').isChecked() //Display output
    console.log(mailServerselected)

    await page.locator('#txtECPopSrvr1').check() //check IMAP
    await expect(page.locator('#txtECPopSrvr')).not.toBeChecked() //validate POP is Unchecked
    const mailServerselected1: boolean = await page.locator('#txtECPopSrvr').isChecked() //Display output
    console.log(mailServerselected1)
})

test('Mouse actions,click and Drag-Drop', async function ({ page }) {

    await page.locator('#Link_10').click();
    await page.waitForTimeout(5000);

    await expect(page.locator('.selectedDiv.custom5').first()).toBeVisible() //get all quicklinks available on page

    //get first tile and move to the icon of 'MOVE' icon using mouse action and click left button of mouse
    const firsttile: Locator = await page.locator('li.selectedDiv.custom5').locator('div.quick-lin-com-9').nth(0)
    await firsttile.hover() //hover first tile
    await firsttile.click({ button: "left" }) //mouse left button click
    await firsttile.locator("//*[@title='Move']").hover() //hover move icon
    await firsttile.locator("//*[@title='Move']").click({ button: "left" })//mouse left button click

    //get locators for source and destination
    const source = await page.locator('.quick-lin-com-9').first()
    const destination = await page.locator('.quick-lin-com-9').last()

    await source.dragTo(destination) //perform drag and drop action

    //Add 'Restricted Holiday' page to quicklink and verify in added in quicklink
    await page.locator('[id="10004"]').click({ button: 'right' }) //mouse right click Action
    await page.locator('[id="addQuickLink-10004"]').click({ button: 'left' })// mouse left button click
    await expect(page.locator('li.selectedDiv.custom5').filter({ hasText: 'Restricted Holidays' })).toBeVisible()
    await page.locator('li.selectedDiv.custom5').filter({ hasText: 'Restricted Holidays' }).dblclick() //double click operation

})


test('Screenshot cases, slow test', async function ({ page }) {

    //test.slow() --It increases the test timeout, typically by 3×.
    await page.locator('#Link_10').click();
    await page.waitForTimeout(5000);

    await expect(page.locator('.selectedDiv.custom5').first()).toBeVisible() //get all quicklinks available on page
    const timestamp = Date.now()
    await page.screenshot({ path: 'screenshot/' + 'module' + timestamp + '.png' })//page SS
    await page.locator('a[id="10004"]').click()
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: 'screenshot/' + 'fullpage' + timestamp + '.png', fullPage: true })//fullpage SS
    const label = await page.getByText('Configure Holidays')
    await label.screenshot({ path: 'screenshot/' + 'label' + timestamp + '.png' }) // Locator SS
})

test.describe('group1',async()=>{
test('Group1_test1', async function ({ page }) {

    console.log('Test1 from grp1')
})
test('Group1_test2', async function ({ page }) {

    console.log('Test2from grp1')
})

})
// To execute Group Test cmd-> npx playwright test tests/login.spec.ts --grep group1
test.describe('group2',async()=>{
test('Group2_test1', async function ({ page }) {

    console.log('Test1 from grp2')
})
test('Group2_test2', async function ({ page }) {

    console.log('Test2from grp2')
})

})


//To Run test based on tags -- cmd ->npx playwright test tests/login.spec.ts --grep '@sanity' 
// To run both tag which include sanity and regression use regular expression
// to run test which include both- npx playwright test tests/login.spec.ts --grep "(?=.*@sanity)(?=.*@regression)" AND opration
// to run test which include any- npx playwright test tests/login.spec.ts --grep "(@sanity|@regression)" OR opration
//to run only Sanity which not belongs to regression- npx playwright test tests/login.spec.ts --grep-invert "@regression" 
//to run except Sanity - npx playwright test tests/login.spec.ts --grep-invert "@sanity" 
test('Group3_test1',{tag:'@sanity'}, async function ({ page }) {

    console.log('Test1 from grp3-sanity')
})
test('Group3_test2',{tag:'@regression'}, async function ({ page }) {

    console.log('Test2from grp3-regression')
})
test('Group4',{tag:['@regression','@sanity']}, async function ({ page }) {

    console.log(' grp4-regression/sanity-Approach1')
})
test('@regression @sanity Group4', async function ({ page }) {

    console.log(' grp4-regression/sanity-Approach2')
})

