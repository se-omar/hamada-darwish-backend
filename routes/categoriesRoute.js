const express = require('express');  
const router = express.Router(); 
const db = require('../database')
const multer = require("multer");
const path = require('path')



var imagedir = path.join(__dirname.substr(0, __dirname.length - 6), "/all-uploads/");
router.use(express.static(imagedir));


var storage = multer.diskStorage({
    destination: "./all-uploads/cat-images",
    filename: function (req, file, cb) {
      cb(null, file.originalname.substr(0, file.originalname.length-4) + Date.now() + ".jpg");
    },
  });
  const upload = multer({
    storage: storage,
  });


router.get('/api/getAllCategories', async(req, res) => {
    var categories = await db.categories.findAll()
    res.json({
        categories,
    })
})

router.post('/api/getCategoryProducts', async(req, res) => {
    var categoryProducts = await db.products.findAll({
        include: [
            {
                model: db.categories
            },
            {
                model: db.brands
            }
        ],
        where: {
            category_id: req.body.Id
        }
    })

    res.json({
        categoryProducts
    })
})

router.post('/api/addCat', async(req, res) => {
    var cat = await db.categories.create({
        name: req.body.name,
        description: req.body.description,
    })
    res.json({
        message: 'brand created successfully',
        cat 
    })
})

router.post('/api/getCatDetails', async(req, res) => {
    var cat = await db.categories.findByPk(req.body.Id)
    res.json({
        message: 'cat aquired',
        cat
    })
})


router.post('/api/deleteCat', async(req, res) => {
    var category = await db.categories.findByPk(req.body.Id)
    await category.destroy()
      res.json({
          message: 'category deleted successfully'
      })
   })
  
   router.post('/api/editCat', upload.single("catImage"), async(req, res) => {
       var cat = await db.categories.findByPk(req.body.Id)
      cat.update({
          name: req.body.name,
          description: req.body.description,
          image:req.file ? 'cat-images/' + req.file.filename : cat.image
      })
      res.json({
          message: 'cat created successfully',
          cat 
      })
  })

module.exports = router;