const express = require('express');  
const router = express.Router(); 
const db = require('../database')

router.get('/api/getAllBrands', async(req, res) => {
    var brands = await db.brands.findAll()
    res.json({
        brands,
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

module.exports = router;