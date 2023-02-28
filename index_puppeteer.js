const puppeteer = require('puppeteer');

(async () =>{
    const browser = await puppeteer.launch({headless: false, devtools: true});
    const page = await browser.newPage();
    await page.goto('https://www.rentomojo.com/mumbai');
    await page.waitForNavigation().catch(err=>{
        console.log(`navigation error ${err}`)
    });
 
    await page.waitForSelector('.rm-listicle__slide h3');
    console.log('started to get product details..')
    let priseInformation = await page.evaluate(()=>{
        let productsInformation = [];
        let nameArrayElement = Array.from(document.querySelectorAll('.rm-listicle__slide'));
        productsInformation = nameArrayElement.map(nameObj =>{
          let name =  nameObj.querySelector('h3').innerText;
          let amount =  nameObj.querySelector('span').innerText;
          return ({
            name,
            amount
          })
        } );
        // let amount = document.querySelector('.rm-listicle__slide span')?.innerText;
        // productsInformation.push({product_name: name, product_prise: amount});
        return productsInformation;
    });
    console.log('end to get product details..');
    console.log('Products informations:=================================================');
    console.log(priseInformation)
    console.log('Products informations:=================================================');
    await browser.close();
}) (); 