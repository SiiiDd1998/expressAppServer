var express = require('express');
var router = express.Router();

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

module.exports = router;
