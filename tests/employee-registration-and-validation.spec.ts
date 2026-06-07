import { test } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { PIMInHomePage, EmployeeDataType} from '../pages/home-page';
import employeeData from '../test-data/employee-data.json' with {type:"json"};

// New Employee Registration & Validation
test('New-Employee-Registration-and-Validation', async({page})=>{
	// Page Objects
		const loginPageIs:LoginPage = new LoginPage(page);
		const PIMInHomePageIs:PIMInHomePage = new PIMInHomePage(page);
		
	// Test Data 
		const adminData:EmployeeDataType["loginCredentials"] = employeeData.admin.loginCredentials;
		const EmployeeData:EmployeeDataType = employeeData.ava;

	// Actions
		// Logging In (as Admin)
			await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
			await loginPageIs.ensuringLoginPage();
			await loginPageIs.loggingIn(adminData.userName, adminData.password);

		// PIM → New Employee Registration & Verification in Employee Record
			await PIMInHomePageIs.ensuringHomePage();
			await PIMInHomePageIs.newEmployeeAddition(EmployeeData);
			await PIMInHomePageIs.ensuringNewEmployeeAddition(EmployeeData);
		
		// Logging Out (as Admin)
			await PIMInHomePageIs.loggingOut();
			await loginPageIs.ensuringLoginPage();

		// Validating the Registered Employee by Logging In
			await loginPageIs.loggingIn(EmployeeData.loginCredentials.userName, EmployeeData.loginCredentials.password);
			await PIMInHomePageIs.ensuringHomePage();
			await PIMInHomePageIs.ensuringUserLoggedInCorrectly(EmployeeData.firstName, EmployeeData.lastName);
			await PIMInHomePageIs.loggingOut();
			await loginPageIs.ensuringLoginPage();
})