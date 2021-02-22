const express = require('express');  
const router = express.Router(); 
const db = require('../database')

router.get('/api/getAllCategories', async(req, res) => {
    var categories = await db.categories.findAll()
    res.json({
        categories,
    })
})

module.exports = router;