var express = require('express');
var router = express.Router();
const User = require('../models/Users')
const CompanyResultDB = require('../models/CompanyResult')
const passwordHasher = require('password-hasher')
const neo4j = require('neo4j-driver');
const driver = new neo4j.driver("bolt://52.252.99.100:7687", neo4j.auth.basic("neo4j", "NuV9sXUJzjve"));

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

    const session = driver.session();

    try {
      const cypher = "CREATE (p:User {name: $name }) RETURN p";
      const params = { name: email };

      const result = await session.run(cypher, params);

      const singleRecord = result.records[0]
      const node = singleRecord.get(0)

      console.log(node.properties.name)
    } catch (e) {
      console.log(e)
    } finally {
      await session.close()
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

router.post('/makeRelation', async (req,res) => {

  try {
    const {user,org} = req.body

    const session = driver.session();

    try {

      for (let i=0; i<org.length; i++) {

        const cypher = "MATCH (a:User {name: $name}), (b:Organisation {name: $org}) CREATE (a)-[r:subscribe]->(b) RETURN r";
        const params = { name: user, org: org[i] };

        const result = await session.run(cypher, params);
      }
    } catch (e) {
      console.log(e)
    } finally {
      await session.close()
    }

    res.send({
      email: user
    })

  } catch (e) {
    res.status(203).send({
      error: e
    })
  }

})

router.post('/getUpdates', async (req, res) => {
  try{
    const {user} = req.body //take from req object

    //Graph query
    const session = driver.session();

    let companies = []

    try {
      const cypher = "MATCH p=(n:User {name: $name})-[r:subscribe]->(m:Organisation) RETURN p";
      const params = { name: user };

      const result = await session.run(cypher, params);

      for (let i=0;i<result.records.length;i++) {
        companies.push(result.records[i]._fields[0].end.properties.name)
      }
      console.log(companies)
    } catch (e) {
      console.log(e)
    } finally {
      await session.close()
    }

    var returnTable = [] //value to be returned
    
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
