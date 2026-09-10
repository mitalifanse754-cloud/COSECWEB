import { Given, When, Then } from '@cucumber/cucumber'
import { POManager } from '../../../PageObjects/POManager'; 

Given('Open Cosec Web', async function () {
  // Write code here that turns the phrase above into concrete actions
  this.pomanager= new POManager(this.page)
  const login=this.pomanager.getloginPage()

  await login.navigateTo(); //navigate to cosec URL

});

When('Login with user', async function (DataTable) {
  const data = DataTable.hashes();

    const username = data[0].username;
    const password = data[0].password;
    const validation = data[0].Validation;
    const login=this.pomanager.getloginPage()
    await login.credential(username,password)
    await login.validateTitle(validation)
});

Given('Delete user via API', async function (dataTable) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Given('Create Leave', async function (dataTable) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Given('Create Leave Group {string} with Pro-rata {string}', async function (string, string2, dataTable) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Given('Create user from user configuration', async function (dataTable) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

When('{string} Leave from Credit_Debit_Encashment page', async function (string, dataTable) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('Verify Leave Balance in Leave Balance Page', async function (dataTable) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});