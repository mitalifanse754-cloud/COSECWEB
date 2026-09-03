import { Page,Expect } from '@playwright/test';
import { Loginpage } from './Loginpage';



export class POManager {

    page: Page;
    login: Loginpage;


    constructor(page: Page) {
        this.page = page;
        this.login = new Loginpage(this.page)
    }

    getloginPage() {
        return this.login;
    }
}
