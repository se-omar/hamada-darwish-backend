const express = require('express');  
const router = express.Router(); 
const db = require('../database')
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());

router.get('/api/getAllFeaturedProducts', async(req, res) => {
    var featuredProducts = await db.products.findAll({
        include: [
            {
                model: db.categories
            },
            {
                model: db.brands
            }
        ],
        where: {
            is_featured: "1"
        }
    })

    res.json({
        featuredProducts
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

router.post('/api/getCategoryAndBrandProducts', async(req, res) => {
    var brandAndCategoryProducts = await db.products.findAll({
        include: [
            {
                model: db.categories
            },
            {
                model: db.brands
            }
        ],
        where: {
            brand_id: req.body.brand_id,
            category_id: req.body.category_id
        }
    })

    res.json({
        brandAndCategoryProducts
    })
})


module.exports = router;