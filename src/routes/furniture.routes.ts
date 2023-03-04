module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const furniture = require('../controllers/furniture.controller');
    var router = require("express").Router();

    //Get the dashboard products data
    router.get('/', furniture.getProductsData);

    //Get all categories
    router.get('/categories', furniture.getAllCategories)

    router.get('/categories/:cat', furniture.getCategoryDetails)

    app.use('/api/furniturs', router)
}