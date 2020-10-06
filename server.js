const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 5000
const app = express();
require('dotenv').con
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.elm9b.mongodb.net/volunteerDB?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });



client.connect(err => {
    const volunteerCollection = client.db("volunteerDB").collection("volunteers");

    //  welcome
    app.get("/", (req, res) => {
        res.send("Welcome volunteer Server")
    })
      //create volunteer
    app.post("/addvolunteer", (req, res) => {
        const volunteer = req.body;
        volunteerCollection.insertOne(volunteer)
            .then(result => {
                console.log('One volunteer Added successfully.')
                res.redirect('/')
            })
        //  console.log(req.body)

    })

    //   read volunteer
    app.get('/getAllVolunteer', (req, res) => {
       
        volunteerCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })

    })

    //   read all volunteer
    app.get('/getvolunteer', (req, res) => {
        const queryEmail = req.query.email;
        // console.log(queryEmail)
        volunteerCollection.find({ email: queryEmail })
            .toArray((err, documents) => {
                res.send(documents)
            })

    })

    //   delete volunteer
    app.delete('/deleteVlunteerList/:listId', (req, res) => {
        //  console.log(req.params.id)
        volunteerCollection.deleteOne({
            _id: ObjectId(req.params.listId)
        })
            .then(result => {
                res.redirect(result.deletedCount > 0)
            })

    })


    //   delete volunteer
    app.delete('/delete/:id', (req, res) => {
        //  console.log(req.params.id)
        volunteerCollection.deleteOne({
            _id: ObjectId(req.params.id)
        })
            .then(result => {
                 res.send(result.deletedCount > 0)
            })

    })


    console.log('database connected.')
    //   client.close();
});


app.listen(process.env.PORT || port)