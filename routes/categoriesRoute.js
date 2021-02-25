const express = require('express');  
const router = express.Router(); 
const db = require('../database')

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

module.exports = router;