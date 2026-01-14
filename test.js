import { chromium } from 'playwright';

async function testCodeRefineStudio() {
  console.log('Starting CodeRefine Studio test...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Navigate to the local server
  const localUrl = 'http://localhost:3000';
  console.log(`Opening ${localUrl}...`);
  
  try {
    await page.goto(localUrl, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Page loaded successfully');
    
    // Check if main elements are present
    const header = await page.$('header');
    console.log('Header present:', !!header);
    
    const editors = await page.$$('.monaco-editor');
    console.log('Monaco editors found:', editors.length);
    
    // Check for the toolbar
    const toolbar = await page.$('button');
    console.log('Toolbar buttons found:', (await page.$$('button')).length);
    
    // Wait a bit for the editor to fully load
    await page.waitForTimeout(2000);
    
    console.log('Test completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testCodeRefineStudio();
