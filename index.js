const fs = require('fs');
const Mailjs = require("@cemalgnlts/mailjs");
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
async function openUrl(url) {
    const open = (await import('open')).default;
    open(url);
}
const mailjs = new Mailjs();

const accountFilePath = './account.json';

async function createAccount() {
    await clearData()
    const acc = await mailjs.createOneAccount()

    console.log(acc);
    // Handle errors gracefully
    if (!acc.status) {
        console.error(acc.message);
        return;
    }

    // Save account data to file directly
    try {
        await fs.promises.writeFile(accountFilePath, JSON.stringify(acc.data));
        console.log('Account data saved successfully!');
    } catch (error) {
        console.error('Error saving account data:', error);
    }
}

async function login() {
    try {
        // Read account data from file directly
        const accountData = JSON.parse(await fs.promises.readFile(accountFilePath, 'utf-8'));
        await mailjs.login(accountData.username, accountData.password)

        const message = await mailjs.getMessages()
        const linkMatch = message.data[0]?.intro.match(/https:\/\/\S+/);
        if (linkMatch) {
            console.log(`Opening link in browser: ${linkMatch[0]}`);
            await openUrl(linkMatch[0]); // Mở link bằng trình duyệt mặc định
        }

        console.log(message.data[0]?.intro);
        return message.data[0]?.intro
    } catch (error) {
        console.error('Error reading account data:', error);
        console.error('Please create an account or ensure the account file exists.');
    }
}

async function clearData() {
    try {
        // Write empty JSON object to clear the file
        await fs.promises.writeFile(accountFilePath, '{}');
        console.log('Account data cleared successfully!');
    } catch (error) {
        console.error('Error clearing account data:', error);
    }
}

async function init() {
    while (true) {
        console.log('\nSelect an action:');
        console.log('1. Create new account');
        console.log('2. Get messages');
        console.log('3. Clear data');
        console.log('4. Exit');

        const option = parseInt(await prompt('Enter your choice: '));

        switch (option) {
            case 1:
                await createAccount();
                break;
            case 2:
                await login();
                break;
            case 3:
                await clearData();
                break;
            case 4:
                console.log('Exiting...');
                readline.close(); // Close readline only on exit
                return;
            default:
                console.error('Invalid option. Please choose from 1 to 4.');
        }
    }
}

async function prompt(message) {
    return new Promise((resolve) => {
        readline.question(message, (answer) => {
            resolve(answer);
        });
    });
}

init();
