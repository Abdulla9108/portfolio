const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    // Simulate iPhone 12 Pro dimensions
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

    console.log("Navigating...");
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    
    // Wait a bit for 3D to render
    await new Promise(r => setTimeout(r, 2000));
    
    // Scroll down a bit to see the phone
    await page.evaluate(() => window.scrollBy(0, 1000));
    await new Promise(r => setTimeout(r, 2000));
    
    console.log("Taking screenshot 1...");
    await page.screenshot({ path: 'screenshot1.png' });
    
    // Remove the opacity rule to see if it fixes it
    await page.evaluate(() => {
        const phoneUI = document.querySelector('.phone-ui');
        if(phoneUI) phoneUI.style.opacity = '1';
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: 'screenshot2.png' });

    // Change background to red to check if CSS3D is there at all
    await page.evaluate(() => {
        const phoneUI = document.querySelector('.phone-ui');
        if(phoneUI) phoneUI.style.background = 'red';
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: 'screenshot3.png' });
    
    await browser.close();
    console.log("Done");
})();
