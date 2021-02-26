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

  router.get('/api/getAllProducts', async(req, res) => {
    var allProducts = await db.products.findAll({
        include: [
            {
                model: db.categories
            },
            {
                model: db.brands
            }
        ],
    })

    res.json({
        allProducts
    })

})

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

router.post("/api/addProduct", upload.array("images", 12), async (req, res, next) => {
    console.log(req.files)
    var product = await db.products.create({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        material: req.body.material,
        is_featured: req.body.isFeatured,
        category_id: req.body.category_id,
        brand_id: req.body.brand_id,
        image1:req.files[0] ? 'products-images/' + req.files[0].filename : '',
        image2:req.files[1] ? 'products-images/' + req.files[1].filename : '',
        image3:req.files[2] ? 'products-images/' + req.files[2].filename : '',
        image4:req.files[3] ? 'products-images/' + req.files[3].filename : '',
        image5:req.files[4] ? 'products-images/' + req.files[4].filename : '',
    })
    res.json({
        message: 'product created',
        product
    })
})

router.post("/api/deleteProduct", async (req, res) => {
    var product = await db.products.findOne({
        where: {
            Id: req.body.Id
        }
    })
    await product.destroy()
    res.json({
        message: 'product deleted',
    })
})

router.post("/api/editProduct",upload.array("images", 12), async (req, res) => {
    console.log(req.body)
    var product = await db.products.findByPk(req.body.Id)

     product.update({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        material: req.body.material,
        is_featured: req.body.isFeatured,
        category_id: req.body.category_id,
        brand_id: req.body.brand_id,
        image1:req.files[0] ? 'products-images/' + req.files[0].filename : product.image1,
        image2:req.files[1] ? 'products-images/' + req.files[1].filename : product.image2,
        image3:req.files[2] ? 'products-images/' + req.files[2].filename : product.image3,
        image4:req.files[3] ? 'products-images/' + req.files[3].filename : product.image4,
        image5:req.files[4] ? 'products-images/' + req.files[4].filename : product.image5,
    })
    res.json({
        message: 'product updated',
        product
    })
})

router.post("/api/addToFeatured", async (req, res) => {
    var product = await db.products.findByPk(req.body.Id)
    product.update({
        is_featured: 1
    })

    res.json({
        message: 'product added'
    })
})

router.post("/api/removeFromFeatured", async (req, res) => {
    var product = await db.products.findByPk(req.body.Id)
    product.update({
        is_featured: 0
    })

    res.json({
        message: 'product removed'
    })
})

module.exports = router;