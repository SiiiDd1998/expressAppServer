var express = require('express');
var router = express.Router();
const User = require('../models/Users')
const CompanyResultDB = require('../models/CompanyResult')
const passwordHasher = require('password-hasher')

function passwordHash(password) {
  const hash = passwordHasher.createHash('ssha512',password,new Buffer('83d88386463f0625', 'hex'))
  const rfcHash = passwordHasher.formatRFC2307(hash)
  return rfcHash;
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async (req, res, next) => {
  try {
    const {password,email} = req.body

    const user1 = await User.findOne({
      email: email
    })

    if(user1) {
      return res.status(203).send({
        error: "email Already Exists"
      })
    }

    req.body.password = passwordHash(password);

    const user = await User.create(req.body)

    res.send({
      email: user.email
    })

  } catch (err) {
    res.status(201).send({
      err: err
    })
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const {email,password} = req.body

    const user = await User.findOne({
      email: email
    })

    if(!user) {
      return res.status(203).send({
        error: "Invalid login info"
      })
    }

    const rfcHash = passwordHash(password);

    if(rfcHash !== user.password) {
      return res.status(203).send({
        error: "Invalid login info"
      })
    }

    res.send({
      email: user.email
    })
  } catch (err) {
    res.status(201).send({
      err: err
    })
  }
})

router.post('/getUpdates', async (req, res) => {
  try{
    const user = 'abcd' //take from req object
    const companies = ['RML.NS', 'SIS.NS', 'IFCI.NS'] //take from graph
    var returnTable = [] //value to be returned
    console.log('started');
    
    for(symbol of companies) {
      console.log('finding for ', symbol);
      
      const result = await CompanyResultDB.findOne({ symbol });
      returnTable.push(result)
    }
    res.json({ table: returnTable });

  } catch(err) {
    console.log(err);
  }
});

module.exports = router;
