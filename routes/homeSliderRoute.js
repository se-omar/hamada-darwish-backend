const express = require('express');  
const router = express.Router(); 
const db = require('../database')
const multer = require("multer");
const path = require('path')
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());

var imagedir = path.join(__dirname.substr(0, __dirname.length - 6), "/all-uploads/");
router.use(express.static(imagedir));

var storage = multer.diskStorage({
    destination: "./all-uploads/slider-images",
    filename: function (req, file, cb) {
      cb(null, file.originalname + Date.now() + ".jpg");
    },
  });
  const upload = multer({
    storage: storage,
  });


  router.get('/api/getSliderData', async(req, res) => {
      var sliderData = await db.home_slider.findByPk(1)
      res.json({
          message: 'data retrieved',
          sliderData
      })
  })

  router.post("/api/editHomeSlider",upload.array("images", 12), async (req, res) => {
    var sliderData = await db.home_slider.findByPk(1)

     sliderData.update({
        text_a1: req.body.text_a1,
        text_a2: req.body.text_a2,
        text_a3: req.body.text_a3,
        text_b1: req.body.text_b1,
        text_b2: req.body.text_b2,
        text_b3: req.body.text_b3,
        text_c1: req.body.text_c1,
        text_c2: req.body.text_c2,
        text_c3: req.body.text_c3,
        image1:req.files[0] ? 'slider-images/' + req.files[0].filename : sliderData.image1,
        image2:req.files[1] ? 'slider-images/' + req.files[1].filename : sliderData.image2,
        image3:req.files[2] ? 'slider-images/' + req.files[2].filename : sliderData.image3,
   
    })
    res.json({
        message: 'sliderData updated',
        sliderData
    })
})

module.exports = router;