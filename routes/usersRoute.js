const express = require('express');  
const router = express.Router(); 
const db = require('../database');
const bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
const cors = require('cors')
const jwt = require("jsonwebtoken");
const checkAuth = require("./check-auth");


router.use(cors());


router.post('/api/signin', (req, res) => {
    db.users.findOne({
        where: {
            email: req.body.email
        },
    }).then(user => {
        if (!user) {
            return res.json({ message: 'user not found' })
        }
        else {
            bcrypt.compare(req.body.password, user.password, function (err, isMatch) {
                if (err) {
                    res.json({ message: 'error' })
                } else if (!isMatch) {
                    res.json({ message: 'authentication failed' })
                } else {
                    jwt.sign({
                        user_id: user.Id,
                        user_email: user.email
                    }, 'secretecommerce4523', (err, token) => {
                        console.log('token is', token)
                        return res.json({
                            message: 'authentication successful',
                            token: token
                        })
                    })

                }
            })
        }
    });

});


router.post("/api/refreshCurrentUser", (req, res) => {
    jwt.verify(req.body.token, "secretecommerce4523", (err, data) => {
        console.log(data)
      if (err) {
        console.log(err);
        res.status(403).send("forbidden 2 api");
      } else {
        db.users
          .findOne({
            where: {
              Id: data.user_id,
            },
          })
          .then((user) => {
            if (!user) {
              return res.json({
                message: "user not found",
              });
            }
            res.json({
              message: "user sent successfully",
              user_id: user.Id,
              user_email: user.email,
            });
          });
      }
    });
  });

module.exports = router;