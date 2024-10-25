import puppeteer from 'puppeteer';
import schedule from 'node-schedule';

// Constants
const URL = 'https://tactics.tools/player/na/viet%20cong%20farmer'; // The webpage URL
const IMAGE_PATH = './wallpaper.jpg';
const INTERVAL = '0 * * * *'; // Cron expression for hourly updates

// Define the clip region (coordinates and dimensions) to capture
const CAPTURE_REGION = {
    x: 470, // x-coordinate of the top-left corner
    y: 520, // y-coordinate of the top-left corner
    width: 980, // Width of the area to capture
    height: 700 // Height of the area to capture
};

async function capturePagePortion(url, path) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Set viewport size as needed
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Capture the defined region as a screenshot
    await page.screenshot({
        path,
        clip: CAPTURE_REGION // Specify the area to capture
    });

    console.log('Captured screenshot of specified page portion.');

    await browser.close();
}

async function updateWallpaper() {
    await capturePagePortion(URL, IMAGE_PATH);
    const wallpaper = await import('wallpaper'); // Dynamically import the wallpaper module
    await wallpaper.setWallpaper(IMAGE_PATH);
    console.log('Wallpaper updated successfully!');
}

function startWallpaperUpdater() {
    updateWallpaper(); // Initial wallpaper update
    schedule.scheduleJob(INTERVAL, updateWallpaper); // Schedule for regular updates
}

startWallpaperUpdater();
