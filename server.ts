import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { Application, Request, Response } from 'express';
import bodyParser from "body-parser";
const puppeteer = require('puppeteer');
require('./src/routes/furniture.routes');
const app: Application = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

//simple route to Scrap the get the furniture data from https://www.rentomojo.com/mumbai 
app.get("/", (req, res) => {
    getData(req, res);
});

app.get("/categories", (req, res) => {
    getAllCategories(req, res);
});

async function getAllCategories(req: Request , res: Response) {
    const furnitureInfo: { categorties: object } = {
        categorties: {}
    };
    const browser = await puppeteer.launch({ headless: false, devtools: true });
    const page = await browser.newPage();
    await page.goto('https://www.rentomojo.com/mumbai');
    await page.waitForNavigation().catch((err: any) => {
        console.log(`navigation error ${err}`)
    });
    await page.waitForSelector('.rm-listicle__slide h3');
    console.log('started to get Categories details..')
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

async function getData(req: Request , res: Response) {
    const furnitureInfo: { priseInformation: object, categorties: object } = {
        priseInformation: {},
        categorties: {}
    };
    const browser = await puppeteer.launch({ headless: false, devtools: true });
    const page = await browser.newPage();
    await page.goto('https://www.rentomojo.com/mumbai');
    await page.waitForNavigation().catch((err: any) => {
        console.log(`navigation error ${err}`)
    });
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

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
console.log("secret code = ", process.env.SECRET_CODE);
// if you want anyone to be able to connect 
app.use(cors({ origin: true }));
//if you want to connect only your frontend to connect 
app.use(cors({ origin: "http://localhost:3000" }));


