const express = require('express');  
const router = express.Router(); 
const db = require('../database')

router.get('/api/getAllProducts', async(req, res) => {
    var products = await db.products.findAll()
    res.json({
        products,
    })
})

module.exports = router;