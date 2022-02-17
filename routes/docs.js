var express = require('express');
var router = express.Router();

const request = require('request');

/* Get all docs details */
router.get('/', async (req, res, next) => {
  try{
    await request({
      url: 'https://api.pandadoc.com/public/v1/documents', 
      headers: {'Authorization' : 'API-Key 9ccb699c0eeb053718a069405ed3bf78cf2f2199'}
    } , function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.send(body)
    }else{
      res.status(500).send({error})
    }
  })
  }
  catch(error){
    res.status(500).send({error})
  }
  
});

/* Create a doc and send it*/
router.post('/:email', async (req, res, next) => {
  try{
    const email = await req.params.email
    await request.post({
      url: 'https://api.pandadoc.com/public/v1/documents', 
      headers: {'Authorization' : 'API-Key 9ccb699c0eeb053718a069405ed3bf78cf2f2199', 'Content-Type' : 'application/json'},
      body: JSON.stringify({
        "name": "OREL IT Aggrement",
        // "template_uuid": "C9mt2di8DrzNjGFrsYaeJD",
        "template_uuid": "dMFqtYRnJ5cyJZWJACYkVE",

        "recipients": [
            {
                "email": email,
                "role": "user"
            }
        ]
      })
    } , async (error, response, body) => {
    if (!error && response.statusCode === 201) {
      const documentId = await JSON.parse(body).id
      await new Promise(resolve => setTimeout(resolve, 3000));
      try{
          await request.post({
            url: `https://api.pandadoc.com/public/v1/documents/${documentId}/send`, 
            headers: {'Authorization' : 'API-Key 9ccb699c0eeb053718a069405ed3bf78cf2f2199', 'Content-Type' : 'application/json'},
            body: JSON.stringify({
              "message": "Hello! This is our aggrement",
              "silent": false
            })
          } , async (errorData, responseData, bodyData) => {
          if (!errorData && responseData.statusCode === 200) {
            res.send(bodyData)
          }else{
            res.status(500).send({error})
          }
        })
      }catch(error){
      res.status(500).send({error})
    }
    }else{
      res.status(500).send({error})
    }
  })
  }catch(error){
    res.status(500).send({error})
  }
})


/* Get client doc details */
router.get('/:document', async (req, res, next) => {
  try{
    const documentId = await req.params.document
    await request({
      url: `https://api.pandadoc.com/public/v1/documents/${documentId}`, 
      headers: {'Authorization' : 'API-Key 9ccb699c0eeb053718a069405ed3bf78cf2f2199'}
    } , async (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.send(body)
    }else{
      res.status(500).send({error})
    }
  })
  }
  catch(error){
    res.status(500).send({error})
  }
})


module.exports = router;
