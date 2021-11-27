const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const { query } = require("express");
const port = process.env.PORT || 5000;
 
app.use(cors());
app.use(express.json());2
 
const uri =
  `mongodb+srv://wintervaccation:n51eZJAtjfxRs74b@cluster0.szuyx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;  
 
 
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
 
async function run() {
  try {
    await client.connect();
    const jaguar = client.db("panther-server");
    const packages = jaguar.collection("products");
    const orders = jaguar.collection("orders");
 
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orders.insertOne(order);
      res.send(result);
    });
 
    app.post("/addPackage", async (req, res) => {
      const order = req.body;
      const result = await packages.insertOne(order);
      res.send(result);
    });
 
    app.get("/user/:email", async (req, res) => {
        const email = req.params.email;
        const quary = { userMail: email };
   
        const cursor = orders.find(quary);
        if ((await cursor.count()) === 0) {
          console.log("No Data Found");
        }
   
        const result = await cursor.toArray();
        res.send(result);
      });
   
      app.get("/packages", async (req, res) => {
        const coursor = packages.find({});
        const result = await coursor.toArray();
        res.send(result);
      });
   
      app.get("/productBy/:id", async (req, res) => {
        const id = req.params.id;
        console.log("getting specific service", id);
        const query = { _id: ObjectId(id) };
        const product = await packages.findOne(query);
        res.json(product);
      });
   
      app.get(`/tickets`, async (req, res) => {
        const cursor = orders.find({});
        const result = await cursor.toArray();
        console.log("ok");
        res.send(result);
      });
   
      // DELETE API
      app.delete("/myOrders/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await orders.deleteOne(query);
        res.json(result);
      });
    } finally {
        //   await client.close();
      }
    }
    run().catch(console.dir);
     
    app.get("/", (req, res) => {
      res.send("Jaguar is Running");
    });
    app.listen(port, () => {
      console.log("Jaguar is Running on PORT:", port);
    });
     
    