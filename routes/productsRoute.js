const express = require('express');  
const router = express.Router(); 
const db = require('../database')
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());

router.get('/api/getAllProducts', async(req, res) => {
    var products = await db.products.findAll({include: [{
        model: db.categories,
    },{
        model: db.brands,
    }]})
    res.json({
        products,
    })
})

router.post('/api/getProductDetails', async(req, res) => {
   var productDetails = await db.products.findOne({
       include: [
           {
               model: db.categories
           },
           {
               model: db.brands
           }
       ],
       where: {
           Id: req.body.Id
       }
   })

   res.json({
       productDetails
   })
})

module.exports = router;