const express = require('express')
const faker = require('faker')
const cors = require('cors')
const Sequelize = require("sequelize");
const bodyParser = require("body-parser");
const db = require("./database");
const app = express()
const port = 3000
var bcrypt = require('bcryptjs');



app.use(cors());


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.set("view engine", "handlebars");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});


const usersRoute = require("./routes/usersRoute.js");
app.use(usersRoute);

const productsRoute = require("./routes/productsRoute.js");
app.use(productsRoute);


const brandsRoute = require("./routes/brandsRoute.js");
app.use(brandsRoute);

const categoriesRoute = require("./routes/categoriesRoute.js");
app.use(categoriesRoute);


const productsBrandsRoute = require("./routes/productsBrandsRoute.js");
app.use(productsBrandsRoute);

const checkoutRoute = require("./routes/checkoutRoute.js");
app.use(checkoutRoute);

const homeSliderRoute = require("./routes/homeSliderRoute.js");
app.use(homeSliderRoute);

const productsCategoriesRoute = require("./routes/productsCategoriesRoute.js");
const { where } = require('sequelize');
app.use(productsCategoriesRoute);


app.get('/', (req, res) => {
  res.send('Hello World!');
})

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

app.post('/api/populateProductsTable', (req, res) => {
  for (let i = 0; i < 100; i++) {
    db.products.create({
      name: faker.commerce.productName(),
      brand_id: getRndInteger(1, 8),
      category_id: getRndInteger(1, 8),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(50, 1500),
      material: faker.commerce.productMaterial(),
      image1: 'https://picsum.photos/1600',
      image2: 'https://picsum.photos/1600',
      image3: 'https://picsum.photos/1600',
      image4: 'https://picsum.photos/1600',
      image5: 'https://picsum.photos/1600',
    })
  }
  res.send('record created')
})

app.post('/api/updateProductsImages',async (req, res) => {

  db.products.update({
    image2: 'products-images/trousers.jpg',
    image3: 'products-images/trousers.jpg',
    image4: 'products-images/trousers.jpg',
    image1: 'products-images/trousers.jpg',
    image5: 'products-images/trousers.jpg',
  },{
    where: {
      category_id: 8
    }
  }).then(abc => {
    res.json({
      message: 'updated'
    })
  })


})


app.post('/api/populateProductsSizesTable',async (req, res) => {
  var products = await db.products.findAll()
  var sizes = await db.sizes.findAll()
  for (let i = 0; i < products.length; i++) {
    for(let j=0; j<5; j++){
      db.products_sizes.create({
        product_id: products[i].Id,
        size_id: sizes[Math.floor(Math.random() * sizes.length)].Id
      })
    }
   
  }
  res.send('records created')
})

// app.post('/api/changePassword',async (req, res) => {
//       bcrypt.hash('eshta123', 10, async (err, hash) => {
//         if (err) {
//             return res.status(500).send(err);
//         } else {
//           var user = await db.users.findOne({
//             where: {email: 'omaraymanadminemail@email.com'}
//           })
//           user.update({
//             password: hash
//           })
//         }
//         res.send(hash)
//       })
 
// })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})