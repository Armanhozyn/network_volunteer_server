const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const port = 5000
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rqp8q.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true});
client.connect(err => {
  const registeredVolunteerCollection = client.db("volunteerNetwork").collection("registeredVolunteer");
  app.post('/registerUrBook',(req,res) => {
    const registeredVolunteer = req.body;
    //console.log(registeredVolunteer);
    registeredVolunteerCollection.insertOne(registeredVolunteer)
    .then(result => {
        res.send(result.insertedCount > 0);
    })
  });

  app.get('/getBookedVolunteer',(req,res)=>{
    registeredVolunteerCollection.find({email : req.query.email})
    .toArray((err,documents)=>{
      res.status(200).send(documents);
    })
  })
   
});



app.listen(process.env.PORT || port);