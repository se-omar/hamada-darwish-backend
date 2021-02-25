const express = require('express');  
const router = express.Router(); 
const db = require('../database')
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require('path')

router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());

var imagedir = path.join(__dirname.substr(0, __dirname.length - 6), "/all-uploads/");
router.use(express.static(imagedir));


var storage = multer.diskStorage({
    destination: "./all-uploads/products-images",
    filename: function (req, file, cb) {
      cb(null, file.originalname + Date.now() + ".jpg");
    },
  });
  const upload = multer({
    storage: storage,
  });



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
    var sizesAr = []
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

   var productSizes = await db.products_sizes.findAll({
       where: {
           product_id: req.body.Id
       }
   })

   for (let i =0; i<productSizes.length; i++){
    var sizeRow = await db.sizes.findOne({
        where: {
            Id: productSizes[i].size_id
        }
    })
    sizesAr.push(sizeRow.name)
   }

   res.json({
       productDetails, productSizes: sizesAr
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