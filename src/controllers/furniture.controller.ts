import { Request, Response } from "express";
import puppeteer from "puppeteer";

exports.getProductsData = async (req: Request, res: Response) => {
    console.log('getProductsData started..');
    const furnitureInfo: { priseInformation: object, categorties: object } = {
        priseInformation: {},
        categorties: {}
    };
    const { page, browser } = await openDashboard();

    await page.waitForSelector('.rm-listicle__slide h3');
    console.log('started to get product details..')
    let priseInformation = await page.evaluate(() => {
        let productsInformation = [];
        let nameArrayElement = Array.from(document.querySelectorAll('.rm-listicle__slide'));
        productsInformation = nameArrayElement.map(nameObj => {
            let name = nameObj.querySelector('h3')?.innerText;
            let amount = nameObj.querySelector('span')?.innerText;
            return ({
                name,
                amount
            })
        });
        console.log('getProductsData completed..');
        return productsInformation;
    });
    console.log('Finished the Furniture info scraping.')
    let categorties = await page.evaluate(() => {
        let categoriesObj: { name: any; }[] = [];
        let categoryElem = document.querySelector('.rm-category__home');
        if (categoryElem !== null) {
            let categoriesData = Array.from(categoryElem.querySelectorAll('li'));

            categoriesObj = categoriesData.map(catObj => {
                let name = catObj?.querySelector('h3')?.innerText;
                return ({ name: name });
            });
        }
        return categoriesObj;
    });
    console.log('Finished the category data scraping..')
    furnitureInfo.priseInformation = priseInformation;
    furnitureInfo.categorties = categorties;
    res.json(furnitureInfo);
    await browser.close();
};

exports.getAllCategories = async (req: Request, res: Response) => {
    const furnitureInfo: { categorties: object } = {
        categorties: {}
    };
    const { page, browser } = await openDashboard();

    let categorties = await page.evaluate(() => {
        let categoriesObj: { name: any; }[] = [];
        let categoryElem = document.querySelector('.rm-category__home');
        if (categoryElem !== null) {
            let categoriesData = Array.from(categoryElem.querySelectorAll('li'));

            categoriesObj = categoriesData.map(catObj => {
                let name = catObj?.querySelector('h3')?.innerText;
                return ({ name: name });
            });
        }
        return categoriesObj;
    });
    console.log('Finished the category data scraping..')
    furnitureInfo.categorties = categorties;
    res.json(furnitureInfo);
    await browser.close();
}

exports.getCategoryDetails = async (req: Request, res: Response) => {
    const { page, browser } = await openDashboard();
    const category = req.params.cat;
    console.log('request data = ', category)
    const categoryDetails = await page.evaluate((category) => {
        let categoriesObj;
        let categoryElem = document.querySelector('.rm-category__home');
        if (categoryElem !== null) {
            let categoriesData = Array.from(categoryElem.querySelectorAll('li'));

            categoriesObj = categoriesData.find(catObj => {
                if (category === catObj?.querySelector('h3')?.innerText) {
                    return true;
                }
            });
            categoriesObj?.querySelector<HTMLAnchorElement>('a')?.click();

            const headersList = Array.from(document.querySelectorAll('h2.rm-main-head')).map((obj: any) => obj.innerText);

            const packageObj = Array.from(document.querySelectorAll('.pack-box--content')).map((obj: any) => obj.innerText);
            setTimeout(() => {
                console.log(headersList);
            }, 30000);
            return { headersList, packageObj }
        }
    }, category);

    await browser.close();
    res.json(categoryDetails);
}

async function openDashboard() {
    console.log('In openDashboard Function')
    const browser = await puppeteer.launch({ headless: false, devtools: true });
    const page = await browser.newPage();
    try {
        await page.goto('https://www.rentomojo.com/mumbai');
        await page.waitForSelector('.rm-listicle__slide h3');
        console.log('Dashboard page open...');
    } catch (error) {
        console.log(`Error in Open Dashboad  function ${error}`);
        browser.close();
    }
    return { page, browser };
}


