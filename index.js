const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jvx2mqj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const allTeacherCollection = client.db('assignment12').collection('allTeachers');
    const allClassesCollection = client.db('assignment12').collection('allClasses');
    const bookedClassCollection = client.db('assignment12').collection('bookedClasses');

    // all teachers
    app.get('/teachers', async(req, res) => {
        const result = await allTeacherCollection.find().toArray();
        res.send(result);
    })

    // all classes
    app.get('/classes', async(req, res) => {
        const result = await allClassesCollection.find().toArray();
        res.send(result);
    })

    app.post('/bookedClasses', async(req, res) => {
      const bookedClass = req.body;
      console.log(bookedClass);
      const result = await bookedClassCollection.insertOne(bookedClass);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('A12 SERVER IN RUNNING');
})

app.listen(port, () => {
    console.log(`A12 server is running at port: ${port}`)
})