const express = require("express");
const app = express();
var cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
app.use(cors());
app.use(express.json());
// var jwt = require("jsonwebtoken");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.y2saknb.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client
      .db("DentalSolutionDB")
      .collection("services");

    const reviewCollectioin = client
      .db("DentalSolutionDB")
      .collection("reviews");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.limit(3).toArray();
      console.log(services);
      res.send(services);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    // Review api

    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollectioin.insertOne(review);
      console.log(result);
      res.send(result);
    });

    app.get("/reviews", async (req, res) => {
      console.log(req.query.service);
      let query = {};
      if (req.query.service) {
        query = {
          service: req.query.service,
        };
      }
      const cursor = reviewCollectioin.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    // get data by email query
    app.get("/myreviews", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviewCollectioin.find(query);
      const byemail = await cursor.toArray();
      res.send(byemail);
    });
  } finally {
  }
}
run().catch((error) => console.error(error));

app.get("/", (req, res) => {
  res.send("Dental Solution Server Running...");
});

app.listen(port, () => {
  console.log(`Server are running on port ${port}`);
});
