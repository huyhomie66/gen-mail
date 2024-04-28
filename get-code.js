const puppeteer = require('puppeteer');

async function getCode() {
    // Khởi tạo trình duyệt
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    // Điều hướng đến URL được cung cấp
    await page.goto('https://api.uprock.com/auth/get_code?id=15bb932ebb');

    // Chờ cho đến khi nút login có sẵn và click vào nó
    await page.waitForSelector('button#get-login-code', { visible: true });
    await page.click('button#get-login-code');

    // Lấy mã login sau khi đã click
    // Ví dụ: bạn có thể chờ đợi một selector nào đó chứa mã login sau khi nó xuất hiện
    const loginCode = await page.waitForSelector('selector-for-login-code');

    // Đóng trình duyệt
    await browser.close();

    // Trả về mã login
    return loginCode;
}

getCode().then(code => {
    console.log('Login Code:', code);
}).catch(err => {
    console.error('Error:', err);
});
