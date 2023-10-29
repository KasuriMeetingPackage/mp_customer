import { defineConfig, test, expect } from '@playwright/test';
export default defineConfig({
    expect: {
        timeout: 10 * 500,
    },
});

test('Valid Login', async ({ page }) => {
    
    var CONFIG = require('./environment.json');

var URL = CONFIG.URL;
var login_email = CONFIG.email;
var login_password = CONFIG.password;
    var TestData = require('./test_data/validlogin.json');

var email = TestData.email;
var password = TestData.password;
    // Perform authentication steps.
    await page.goto(URL);
    //await page.selectOption("#lang_dropdown", value="en")
    await page.locator("#edit-name").fill(email);
    await page.locator("#edit-pass").fill(password);
    await page.locator("#edit-submit").click();
    await page.waitForURL('https://dev.meetingpackage.com/dashboard');
    await expect(page).toHaveTitle("Welcome to your Dashboard | MeetingPackage");

    // End of authentication steps.
});

test('Login attempt without entering email or password', async ({ page }) => {
   
    var CONFIG = require('./environment.json');

    var URL = CONFIG.URL;
   

    // Perform authentication steps.
    await page.goto(URL);
    
    await page.locator("#edit-name").click();
    await page.locator("#edit-pass").click();
    await page.locator("#edit-submit").click();

    await expect(page.locator('text=E-mail or username field is required.')).toHaveText('E-mail or username field is required.');
    await expect(page.locator('text=Password field is required.')).toHaveText('Password field is required.');

    // End of authentication steps.
});



test('Login attempt with wrong password', async ({ page }) => {
    var CONFIG = require('./environment.json');
    var URL = CONFIG.URL;
    var test_data = require('./test_data/invalidlogin.json');

    var email = test_data[0].email;
    var password = test_data[0].password;
    await page.goto(URL);
    
    await page.locator("#edit-name").fill(email);
    await page.locator("#edit-pass").fill(password);
    await page.locator("#edit-submit").click();
    await page.getByText('Password field is required.').click();

    await expect(page.locator('text=Password field is required.')).toHaveText('Password field is required.')
});

test('Forget Password', async ({ page }) => {
    var CONFIG = require('./environment.json');
    var URL = CONFIG.URL;

    var test_data = require('./test_data/invalidlogin.json');

    var email = test_data[1].email;
    var password = test_data[1].password;
    // 1. Perform authentication steps.
    await page.goto(URL);

    // 2. Click on the "Forgot Password" link.
    await page.locator("text = Forgot username or password?").click();

    // 3. Enter the user's email.
    await page.locator("#edit-name").fill(email);


    // 4. Submit the form to request a password reset.
    await page.locator("text= E-mail new password").click();

    const isVisible = await page.isVisible('text= is not recognized as a user name or an e-mail address.');
    expect(isVisible).toBe(false);
    //System does not displayed any success messages, since made the validation for error messages
    //5. Check for a Error message.


    const urlToNavigate = 'https://dev.meetingpackage.com/user/login'; // Replace with the URL you want to navigate to.

    try {
        // Navigate to the specified URL.
        await page.goto(urlToNavigate);

        // Check if the navigation was successful.
        const currentURL = page.url();
        if (currentURL === urlToNavigate) {
            console.log(`Successfully navigated to ${urlToNavigate}`);
        } else {
            console.error(`Failed to navigate to ${urlToNavigate}. Current URL is: ${currentURL}`);
        }
    } catch (error) {
        console.error(`An error occurred: ${error}`);
    } finally {
        //await browser.close();
    }



})

