const puppeteer = require('puppeteer')
const faker = require('faker')

const user = {
    idUpdate: '3',
    textUpdate: 'test',
  };

const isDebugging = () => {
    let debugging_mode = {
      headless: false,
      slowMo: 50,
      devtools: true,
    };
    return process.env.NODE_ENV === 'debug' ? debugging_mode : {};
  };
  
  let browser;
  let page;
  beforeAll(async () => {
    browser = await puppeteer.launch(isDebugging());
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
    page.emulate(iPhone);
  
    await page.setRequestInterception(true);  
    page.on('request', interceptedRequest => {  
      if (interceptedRequest.url().includes('pokeapi')) {  
        interceptedRequest.abort();  
      } else {  
        interceptedRequest.continue();  
      }  
    });
  
  });
  
  describe('login form', () => {  
    test(
      'fills out form and submits',
      async () => {
        const idUpdate = await page.$('[data-testid="idUpdate"]');
        const textUpdate = await page.$('[data-testid="UpdateText"]');
  
        await idUpdate.tap();
        await page.type('[data-testid="idUpdate"]', user.idUpdate);
  
        await textUpdate.tap();
        await page.type('[data-testid="UpdateText"]', user.textUpdate);
  
        await submitEl.tap();
  
        await page.waitForSelector('[data-testid="Success"]');
      },
      1600000
    );
  })
  
  afterAll(() => {
    if (isDebugging()) {
      browser.close();
    }
  });