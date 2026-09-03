import { Page, Locator, expect } from '@playwright/test';


interface Elements {
    userid: Locator;
    password: Locator;
    loginButton: Locator;
}

export class Loginpage {

    page: Page;
    cosecUrl: string;

    private elements: Elements;

    constructor(page: Page) {
        this.page = page
        this.cosecUrl = 'https://192.168.27.135';
        this.elements = {
            loginButton: this.page.getByRole('button', { name: 'Login' }),
            userid: this.page.locator('#loginid'),
            password: this.page.locator('#pwd')
        };
    }

    async navigateTo() {
        await this.page.goto(`${this.cosecUrl}/cosec/login`);
    }

    async credential(userid: string, password: string ) {
        await this.elements.userid.fill(userid);
        await this.elements.password.fill(password);
        await this.elements.loginButton.click();
        
    }

    async validateTitle(validation:string){
        await expect(this.page).toHaveTitle(new RegExp(`^${validation}$`, "i"));
    }

}