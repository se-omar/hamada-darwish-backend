const express = require('express');  
const router = express.Router(); 
const db = require('../database')

router.get('/api/getAllBrands', async(req, res) => {
    var brands = await db.brands.findAll()
    res.json({
        brands,
    })
})

module.exports = router;