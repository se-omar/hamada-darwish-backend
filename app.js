const express = require('express')
const faker = require('faker')
const Sequelize = require("sequelize");
const db = require("./database");
const app = express()
const port = 3000


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

const productsCategoriesRoute = require("./routes/productsCategoriesRoute.js");
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})