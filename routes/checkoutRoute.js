const express = require('express');  
const router = express.Router(); 
const db = require('../database')
const multer = require("multer");
const path = require('path')
let crypto = require("crypto");
const orderid = require('order-id')('eshta123');
const nodemailer = require('nodemailer')
const ejs = require('ejs');
const host = 'http://localhost:3000'

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
    var shipping = 20
    console.log(cartProducts)
    for(let i =0; i<cartProducts.length; i++){
        var product = await db.products.findByPk(cartProducts[i].Id)
        product.quantity = cartProducts[i].quantity
        product.size = cartProducts[i].size
        orderProducts.push(product)
        orderTotalPrice += parseFloat(product.price) * cartProducts[i].quantity
    }
    const html = await ejs.renderFile(
                'ejs/nodemailer-html.ejs',
            {   orderProducts,
                cartProducts,
                orderTotalPrice,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                mobile: req.body.mobile,
                streetName: req.body.streetName,
                building: req.body.building,
                floor: req.body.floor,
                apartment: req.body.apartment,
                region: req.body.region,
                orderNotes: req.body.orderNotes,
                shipping
            }
    )

    const attachments = []
    for(let i =0; i<orderProducts.length; i++){
        var attachment = {
            filename: `${'product' + i + '.jpg'}`,
            path: `${host + '/' + orderProducts[i].image1}`,
            cid: `${'image' + i}`
        }
        attachments.push(attachment)
    }

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
        to: 'miroayman639@gmail.com', // list of receivers
        subject: "order was made", // Subject line
        text: "Please activate from here", // plain text body
        html: html,
        attachments: attachments
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