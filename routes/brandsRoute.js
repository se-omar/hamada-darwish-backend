const express = require('express');  
const router = express.Router(); 
const db = require('../database')
const multer = require("multer");
const path = require('path')



var imagedir = path.join(__dirname.substr(0, __dirname.length - 6), "/all-uploads/");
router.use(express.static(imagedir));


var storage = multer.diskStorage({
    destination: "./all-uploads/brands-images",
    filename: function (req, file, cb) {
      cb(null, file.originalname.substr(0, file.originalname.length-4) + Date.now() + ".jpg");
    },
  });
  const upload = multer({
    storage: storage,
  });


router.get('/api/getAllBrands', async(req, res) => {
    var brands = await db.brands.findAll()
    res.json({
        brands,
    })
})

router.post('/api/getBrandDetails', async(req, res) => {
    var brand = await db.brands.findByPk(req.body.Id)
    res.json({
        message: 'brand aquired',
        brand
    })
})


router.post('/api/getBrandProducts', async(req, res) => {
    var brandProducts = await db.products.findAll({
        include: [
            {
                model: db.categories
            },
            {
                model: db.brands
            }
        ],
        where: {
            brand_id: req.body.Id
        }
    })

    res.json({
        brandProducts
    })
})


router.post('/api/getBrandDetailsAndProducts', async(req, res) => {
    var brandDetails = await db.brands.findOne({
        where: {
            Id: req.body.Id
        }
    })

    var brandProducts =  await db.products.findAll({
        include: [
            {
                model: db.categories
            },
            {
                model: db.brands
            }
        ],
        where: {
            brand_id: req.body.Id
        }
    })
 
    res.json({
        brandDetails, brandProducts
    })
 })


 router.post('/api/addBrand', upload.single("brandImage"), async(req, res) => {
    console.log("The body is: ", req.body);
    console.log('the image is:', req.file)
    var brand = await db.brands.create({
        name: req.body.name,
        description: req.body.description,
        image: 'brand-images/' + req.file.filename
    })
    res.json({
        message: 'brand created successfully',
        brand 
    })
})


router.post('/api/deleteBrand', async(req, res) => {
  var brand = await db.brands.findByPk(req.body.Id)
  await brand.destroy()
    res.json({
        message: 'brand deleted successfully'
    })
 })

 router.post('/api/editBrand', upload.single("brandImage"), async(req, res) => {
     var brand = await db.brands.findByPk(req.body.Id)
    brand.update({
        name: req.body.name,
        description: req.body.description,
        image:req.file ? 'brand-images/' + req.file.filename : brand.image
    })
    res.json({
        message: 'brand created successfully',
        brand 
    })
})

module.exports = router;