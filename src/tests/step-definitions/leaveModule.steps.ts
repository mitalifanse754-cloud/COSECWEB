import { Given, When, DataTable } from '@cucumber/cucumber'
import { POManager } from '../../../PageObjects/POManager'; 

Given('Open COSEC Web', async function () {
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