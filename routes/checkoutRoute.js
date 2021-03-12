const express = require('express');  
const router = express.Router(); 
const db = require('../database')
const multer = require("multer");
const path = require('path')
let crypto = require("crypto");
const orderid = require('order-id')('eshta123');
const nodemailer = require('nodemailer')
const ejs = require('ejs');

router.post('/api/generateKashierOrderHash', async(req, res) => {
    const orderId = orderid.generate();
    var totalOrderPrice = 0;
    const cartProducts = JSON.parse(req.body.cartProducts)
    console.log(cartProducts)
    for(let i=0; i<cartProducts.length; i++){
        var product = await db.products.findByPk(cartProducts[i].Id)
        var priceNum = parseFloat(product.price)
        totalOrderPrice += priceNum * cartProducts[i].quantity
        console.log(totalOrderPrice)
    }
    totalOrderPrice += 20
    var order = {
    amount: totalOrderPrice.toString(),
    currency: "EGP",
    merchantOrderId: orderId.toString(),
    }


res.json({
    hash:generateKashierOrderHash(order),
    amount: totalOrderPrice.toString(),
    orderId: orderId.toString()

})
})

function generateKashierOrderHash(order){
const mid = "MID-6166-145"; //your merchant id
const amount = order.amount; //eg: 22.00
const currency = order.currency; //eg: "EGP"
const orderId = order.merchantOrderId; //eg: 99
const secret = "5f2f8742-c02e-4946-bc64-3622b5407c1c";
//eg: "5f2f8742-c02e-4946-bc64-3622b5407c1c"
const path = `/?payment=${mid}.${orderId}.${amount}.${currency}`;
const hash = crypto.createHmac('sha256', secret)
.update(path)
.digest('hex');
return hash;
}

router.post('/api/placeCashOrder', async(req, res) => {
    var cartProducts = JSON.parse(req.body.cartProducts)
    var orderProducts = []
    var orderTotalPrice = 0
    console.log(cartProducts)
    for(let i =0; i<cartProducts.length; i++){
        var product = await db.products.findByPk(cartProducts[i].Id)
        orderProducts.push(product)
        orderTotalPrice += parseFloat(product.price) * cartProducts[i].quantity
    }
    const html =  ejs.render(
        `<h1>A new order was made</h1>
        <h4 style="display: inline; margin-right: 30px">full name: <%= firstName + ' ' + lastName %></h4>
        <h4 style="display: inline; margin-right: 30px">email: <%= email %></h4>
        <h4 style="display: inline; margin-right: 30px">mobile: <%= mobile %></h4>
        <h4 style="display: inline; margin-right: 30px">street name: <%= streetName %></h4>
        <h4 style="display: inline; margin-right: 30px">building: <%= building %></h4>
        <h4 style="display: inline; margin-right: 30px">floor: <%= floor %></h4>
        <h4 style="display: inline; margin-right: 30px">apartment: <%= apartment %></h4>
        <h4 style="display: inline; margin-right: 30px">region: <%= region %></h4>
        <% for(let j=0; j<orderProducts.length; j++){%>
            <h4>product name: <%= orderProducts[j].name %></h4>
            <h4>product price: <%= orderProducts[j].price %></h4>
            <img src="'http://localhost:3000/' + <%= orderProducts[j].image1 %>">
            <h4>product quantity: <%= cartProducts[j].quantity %></h4>
            <h4>size: <%= cartProducts[j].size %></h4>
            <% } %>`,
            {   orderProducts: orderProducts,
                cartProducts: cartProducts,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                mobile: req.body.mobile,
                streetName: req.body.streetName,
                building: req.body.building,
                floor: req.body.floor,
                apartment: req.body.apartment,
                region: req.body.region
            }
    )
    let transporter = nodemailer.createTransport({
        service: "gmail",
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'miroayman6198@gmail.com', // generated ethereal user
            pass: 'eshta123', // generated ethereal password
        },
        tls: {
            regectUnauthorized: false
        }
    });

    let mailOptions = {
        from: 'store name', // sender address
        to: req.body.email, // list of receivers
        subject: "order was made", // Subject line
        text: "Please activate from here", // plain text body
        html: html
    };

    transporter.sendMail(mailOptions, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("email sent!!!!")
        }
    })
    res.json({
        message: 'email sent'
    })

})


module.exports = router;