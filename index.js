const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const bandsData = './bands-data.json';
// const products = require("./band-product.json")

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7u0ly7l.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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
   

   
    const addProductCollections = client.db('addProductsDB').collection('addProducts');
    const newProductForCartCollections = client.db('addProductsDB').collection('cartProducts');

    app.get('/addProducts', async(req, res) => {
      const cursor = addProductCollections.find()
      const result = await cursor.toArray();
      res.send(result)
    })
    
    app.get('/addProducts/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await addProductCollections.findOne(query);
      res.send(result);
    })

     app.post('/addProducts', async(req, res) => {
        const newProduct = req.body;
        console.log(newProduct);
        const result = await addProductCollections.insertOne(newProduct)
        res.send(result)
     })

     app.post('/cartProducts', async(req, res) => {
      const newProductForCart = req.body;
      const result = await newProductForCartCollections.insertOne(newProductForCart)
      res.send(result);
     })

     app.delete('/cartProducts/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: id}
      const result = await newProductForCartCollections.deleteOne(query)
      res.send(result);
     })

     app.get('/cartProducts', async(req, res) => {
      const cursor = newProductForCartCollections.find()
      const result = await cursor.toArray();
      res.send(result);
     })
     

     app.put('/addProducts/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const option = { upsert: true }
      const updatedProducts = req.body;
      const products = {
          $set: {
              image_url: updatedProducts.image_url,
              name: updatedProducts.name,
              rating: updatedProducts.rating,
              Price: updatedProducts.Price,
              band_name: updatedProducts.band_name,
              type: updatedProducts.type,
              details: updatedProducts.details,

          }
      }
      const result = await addProductCollections.updateOne(filter, products, option);
      res.send(result)
  })
      app.get('/brands/:band_name', async(req, res) => {
          const band_name = req.params.band_name;
          const query = {band_name: band_name}
          const result = await addProductCollections.find(query).toArray();
          res.send(result)

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



     
app.get('/bands', (req, res) => {
  const data = require(bandsData);
  res.json(data);
});



app.get("/", (req, res) => {
    res.send("Welcome to our ElectroTech Insights")
})
app.listen(port, () => {
    console.log(`Welcome to our ElectroTech Insights ${port}` );
})