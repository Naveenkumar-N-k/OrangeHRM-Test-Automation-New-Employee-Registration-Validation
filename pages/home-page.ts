import { expect, Locator, Page } from "@playwright/test"

export class HomePage{
  readonly headerBanner:Locator; 
  readonly profileBoxInBanner:Locator; 
  readonly userIconImageInProfileBox:Locator; 
  readonly userNameInProfileBox:Locator; 
  readonly logoutInDropDownOfUserIcon:Locator; 
  readonly sidepanelOptions:Locator; 
  readonly PIMInSidepanel:Locator 

  constructor(protected readonly page:Page){
    // Header Banner Locators
      this.headerBanner = this.page.getByRole('banner')
                                  .filter({has:this.page.getByRole('img',{name:/profile picture/i})});            
      this.profileBoxInBanner = this.headerBanner.getByRole('list')
                                                .filter({has:this.page.getByRole('img',{name:/profile picture/i})});
      this.userIconImageInProfileBox = this.profileBoxInBanner.getByRole('img',{name:/profile picture/i});
      this.userNameInProfileBox = this.profileBoxInBanner.getByRole('img',{name:/profile picture/i}).locator('..')
                                                        .getByRole('paragraph');
      this.logoutInDropDownOfUserIcon = this.profileBoxInBanner.getByRole('menuitem', {name:/^logout$/i});
    
    // Sidepanel Locators
      this.sidepanelOptions = this.page.getByRole('navigation',{name:/^sidepanel$/i}).getByRole('list');
      this.PIMInSidepanel = this.sidepanelOptions.getByText(/^PIM$/i);
  }
  
  async ensuringHomePage():Promise<void>{
    await expect(this.headerBanner).toBeVisible();
    await expect(this.userNameInProfileBox).toBeVisible();
    await expect(this.sidepanelOptions).toBeVisible();
  }

  async ensuringUserLoggedInCorrectly(employeeFirstName:string, employeeLastName:string):Promise<void>{
    await expect(this.userNameInProfileBox).toHaveText(`${employeeFirstName} ${employeeLastName}`);
    await this.page.screenshot({path:'target-user-logged-in-successfully.png'})
  }

  async loggingOut():Promise<void>{
    await this.userIconImageInProfileBox.click();
    await this.logoutInDropDownOfUserIcon.click();
  }
}

export type EmployeeDataType = {
    readonly firstName:string;
    readonly middleName:string;
    readonly lastName:string;
    readonly employeeId:string;
    readonly loginCredentials:{
      readonly userName:string;
      readonly password:string;
    };
  }

const throwingError:(message:string) => never = (message:string) => {throw new Error(message)};

export class PIMInHomePage extends HomePage {
  readonly topbarMenu:Locator; 
  readonly employeeListInTopbarMenu:Locator; 
  readonly addEmployeeInTopbarMenu:Locator; 
  readonly addEmployeeForm:Locator; 
  readonly newEmployeeFirstName:Locator; 
  readonly newEmployeeMiddleName:Locator; 
  readonly newEmployeeLastName:Locator; 
  readonly newEmployeeEmployeeId:Locator; 
  readonly createLoginDetailsCheckbox:Locator; 
  readonly newEmployeeUserName:Locator; 
  readonly newEmployeePassword:Locator;
  readonly newEmployeeConfirmPassword:Locator; 
  readonly newEmployeeEnabledStatus:Locator; 
  readonly saveButtonInAddEmployeeForm:Locator; 
  readonly employeeNameInSearch:Locator;
  readonly employeeIdInSearch:Locator;
  readonly searchButtonInSearch:Locator;
  readonly searchedEmployeesTable:Locator;
  readonly recordsFoundTextBanner:Locator;
  

  constructor(page:Page){
    // Including Header Banner, Sidepanel Locators from Homepage
      super(page);
    
    // Topbar Menu Locators
      this.topbarMenu = this.headerBanner.getByRole('navigation',{name:/topbar menu/i})
                                                .filter({hasText:/employee list/i})
                                                .filter({hasText:/add employee/i});
      this.employeeListInTopbarMenu = this.topbarMenu.getByRole('link',{name:/employee list/i});
      this.addEmployeeInTopbarMenu = this.topbarMenu.getByRole('link',{name:/add employee/i});
      
    // Add Employee option → New Employee Form Locators
      this.addEmployeeForm = this.page.getByRole('heading',{level:6, name:/add employee/i}).locator('..')
																								.filter({has:this.page.locator('form')})
																								.locator('form');

      // New Employee Form - Basic Info Locators
        this.newEmployeeFirstName = this.addEmployeeForm.getByRole('textbox').and(this.addEmployeeForm.locator('[name="firstName"]'));
        this.newEmployeeMiddleName = this.addEmployeeForm.getByRole('textbox').and(this.addEmployeeForm.locator('[name="middleName"]'));
        this.newEmployeeLastName = this.addEmployeeForm.getByRole('textbox').and(this.addEmployeeForm.locator('[name="lastName"]'));
        this.newEmployeeEmployeeId = this.addEmployeeForm.locator('label').and(this.addEmployeeForm.getByText(/^employee id$/i))
                                                          .locator('../..').getByRole('textbox');

      // New Employee Form - Login Credentials Locators
        this.createLoginDetailsCheckbox = this.addEmployeeForm.getByText(/create login details/i)
                                                                      .locator('..').locator('label').locator('span');			
        this.newEmployeeUserName = this.addEmployeeForm.locator('label').and(this.addEmployeeForm.getByText(/^username$/i))
                                                    .locator('../..').getByRole('textbox');
        this.newEmployeePassword = this.addEmployeeForm.locator('label').and(this.addEmployeeForm.getByText(/^password$/i))
                                                    .locator('../..').getByRole('textbox');
        this.newEmployeeConfirmPassword = this.addEmployeeForm.locator('label')
                                                        .and(this.addEmployeeForm.getByText(/^confirm password$/i))
                                                        .locator('../..').getByRole('textbox');
        this.newEmployeeEnabledStatus = this.addEmployeeForm.locator('label').filter({hasText:/^enabled$/i}).getByRole('radio');
        this.saveButtonInAddEmployeeForm = this.addEmployeeForm.getByRole('button',{name:/save/i});
                                                               
    // Employee List option → Search Box Locators
      this.employeeNameInSearch = this.page.locator('label').and(this.page.getByText(/^employee name$/i)).locator('../..')
																												.getByRole('textbox');
			this.employeeIdInSearch = this.page.locator('label').and(this.page.getByText(/^employee id$/i)).locator('../..')
																												.getByRole('textbox');
			this.searchButtonInSearch = this.page.getByRole('button',{name:/search/i});
			
      // Result table Locators 
      this.searchedEmployeesTable = this.page.getByRole('table')
																									.filter({has:this.page.getByRole('rowgroup')})
																									.filter({has:this.page.getByRole('row')});
			this.recordsFoundTextBanner = this.page.locator('span').filter({hasText:/records? found/i});
      
  }
  
  async newEmployeeAddition(newEmployeeData:EmployeeDataType):Promise<void>{
    // PIM 
      await this.PIMInSidepanel.click();
      await expect(this.headerBanner.getByRole('heading', {level:6, name:/^PIM$/i})).toHaveText(/^PIM$/i);

    // Add Employee Option in PIM
      await this.addEmployeeInTopbarMenu.click();

    // Filling & Saving the form
      await expect(this.page.getByRole('heading',{level:6, name:/add employee/i})).toHaveText(/^Add Employee$/i);
      await this.newEmployeeFirstName.fill(newEmployeeData.firstName);
      await this.newEmployeeMiddleName.fill(newEmployeeData.middleName);
      await this.newEmployeeLastName.fill(newEmployeeData.lastName);
      await this.newEmployeeEmployeeId.fill(newEmployeeData.employeeId);
      await this.createLoginDetailsCheckbox.click();
      await this.newEmployeeUserName.fill(newEmployeeData.loginCredentials.userName);
      await this.newEmployeePassword.fill(newEmployeeData.loginCredentials.password);
      await this.newEmployeeConfirmPassword.fill(newEmployeeData.loginCredentials.password);
      await this.newEmployeeEnabledStatus.check();
      await this.saveButtonInAddEmployeeForm.click();
      await this.page.waitForURL(/.*pim\/viewPersonalDetails\/empNumber.*\d/i, {waitUntil:"load"})
      await this.page.screenshot({path:'new-employee-registered.png'});
  
  }

  async ensuringNewEmployeeAddition(employeeData:EmployeeDataType):Promise<void>{
    // PIM 
      await this.PIMInSidepanel.click();
      await expect(this.headerBanner.getByRole('heading', {level:6, name:/^PIM$/i})).toHaveText(/^PIM$/i);
    
    // Employee List Option in PIM
      await this.employeeListInTopbarMenu.click();
      await expect(this.page.getByRole('heading', {level:5, name:/^Employee Information$/i})).toHaveText(/^Employee Information$/i);

    // Searching the newly added Employee
      await this.employeeNameInSearch.fill(`${employeeData.firstName} ${employeeData.lastName}`);
      await this.employeeIdInSearch.fill(employeeData.employeeId);
      await this.searchButtonInSearch.click();

    // Ensuring the table to have the newly added employee (unique)
      await expect(this.searchedEmployeesTable.getByText(employeeData.employeeId)).toBeVisible();
      await expect(this.recordsFoundTextBanner).toBeVisible();
      const RecordsFoundText:string = await this.recordsFoundTextBanner.textContent() ?? throwingError('No Text Content Found');
      const noOfRecordsFound:number = Number(RecordsFoundText.match(/\d+/)?.[0] ?? throwingError('No Number Match Found in Records Found banner'));
      if(noOfRecordsFound!==1){
        if(noOfRecordsFound===0) {throwingError(`No records Found`)}
        else {throwingError(`Multiple records Found`)}
      }
      await this.searchedEmployeesTable.scrollIntoViewIfNeeded();
      await this.page.screenshot({path:'searched-employee-table.png'});
  }
}