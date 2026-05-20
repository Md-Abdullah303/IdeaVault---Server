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
    const commentCollection = db.collection("comments");

    // get
    app.get("/ideas", async (req, res) => {
      const { search, filter, shorting } = req.query;
      // console.log(query);

      let query = {};
      let shortingOptions = {};

      if (search) {
        query.title = {
          $regex: search,
          $options: "i",
        };
      }

      if (filter) {
        query.category = {
          $regex: filter,
          $options: "i",
        };
      }

      // shorting
      if (shorting === "highToLow") {
        shortingOptions = {
          estimatedBudget: -1,
        };
      }
      if (shorting === "lowToHigh") {
        shortingOptions = {
          estimatedBudget: 1,
        };
      }

      const cursor = ideasCollection.find(query).sort(shortingOptions);
      const result = await cursor.toArray();
      res.json(result);
    });
    app.get("/featured", async (req, res) => {
      const cursor = ideasCollection.find().limit(6);

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
    app.get("/my-ideas/:userId", async (req, res) => {
      const { userId } = req.params;
      const result = await ideasCollection.find({ userId: userId }).toArray();
      // console.log("userId and result: ", result, userId);
      res.json(result);
    });
    app.get("/comment", async (req, res) => {
      const result = await commentCollection.find().toArray();
      res.json(result);
    });
    app.get("/comment/:postId", async (req, res) => {
      const { postId } = req.params;
      const cursor = commentCollection.find({
        postId: postId,
      });
      const result = await cursor.toArray();
      res.json(result);
    });
    app.get("/comment/user/:userId", async (req, res) => {
      const { userId } = req.params;
      const cursor = commentCollection.find({ userId: userId });
      const result = await cursor.toArray();
      res.json(result);
    });

    // post
    app.post("/ideas", async (req, res) => {
      const newIdeas = req.body;
      //   console.log(newIdeas);
      const result = await ideasCollection.insertOne(newIdeas);
      res.json(result);
    });
    app.post("/comment", async (req, res) => {
      const newComment = req.body;
      const result = await commentCollection.insertOne(newComment);
      res.json(result);
    });

    // patch
    app.patch("/ideas/:ideasId", async (req, res) => {
      const { ideasId } = req.params;

      if (!ObjectId.isValid(ideasId)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const updateIdeas = req.body;

      console.log("ideasId and updeted Data: ", ideasId, updateIdeas);
      const result = await ideasCollection.updateOne(
        {
          _id: new ObjectId(ideasId),
        },
        { $set: updateIdeas },
      );

      res.json(result);
    });

    // delete
    app.delete("/ideas/:id", async (req, res) => {
      const { id } = req.params;
      const result = await ideasCollection.deleteOne({ _id: new ObjectId(id) });

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
