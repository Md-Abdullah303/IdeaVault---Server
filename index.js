const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3040;

// middleware
app.use(cors());
app.use(express.json());

// mongodb url
const uri = process.env.MONGODB_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("ideaVault");
    const ideasCollection = db.collection("ideas");

    // "/ideas"
    app.get("/ideas", async (req, res) => {
      const cursor = ideasCollection.find();

      const result = await cursor.toArray();
      res.json(result);
    });

    app.get("/ideas/:ideasId", async (req, res) => {
      const { ideasId } = req.params;
      //   console.log(ideasId);
      const result = await ideasCollection.findOne({
        _id: new ObjectId(ideasId),
      });
      res.json(result);
    });

    app.post("/ideas", async (req, res) => {
      const newIdeas = req.body;
      //   console.log(newIdeas);
      const result = await ideasCollection.insertOne(newIdeas);
      res.json(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running without error...");
});

app.listen(port, () => {
  console.log(`Server running on Port : ${port}`);
});

// IdeaVault
//gichl0wCwvtQcOih
