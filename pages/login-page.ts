import { expect, Locator, Page } from "@playwright/test"

export class LoginPage{
  readonly userName:Locator; readonly password:Locator; readonly loginButton:Locator;

  constructor(private page:Page){
    this.userName = this.page.getByRole('textbox').and(this.page.locator('[name="username"]'));
    this.password = this.page.getByRole('textbox').and(this.page.locator('[name="password"]'));
    this.loginButton = this.page.getByRole('button',{name:/^login$/i});
  }

  async ensuringLoginPage():Promise<void>{
    await expect(this.userName).toBeVisible();
    await expect(this.password).toBeVisible();
  }

  async loggingIn(userName:string, password:string):Promise<void>{
    await this.userName.fill(userName);
    await this.password.fill(password);
    await this.loginButton.click();
  }

}




