var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async (req, res, next) => {
  try {
    const {password,username} = req.body

    const user1 = await User.findOne({
      username: username
    })

    if(user1) {
      return res.status(203).send({
        error: "UserName Already Exists"
      })
    }

    req.body.password = passwordHash(password);

    const user = await User.create(req.body)

    const token = jwt.sign(
        {user: user},
        config.privateKey,
        {expiresIn: 3600}
    )

    res.send({
      username: user.username,
      token: token
    })
  } catch (err) {
    res.status(201).send({
      err: err
    })
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const {username,password} = req.body

    const user = await User.findOne({
      username: username
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

    const token = jwt.sign(
        {user: user},
        config.privateKey,
        {expiresIn: 60*60}
    )

    res.send({
      username: user.username,
      token: token
    })
  } catch (err) {
    res.status(201).send({
      err: err
    })
  }
})

module.exports = router;
