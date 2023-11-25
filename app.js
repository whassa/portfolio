const express = require("express");
const { MongoClient } = require("mongodb");
const sanitize = require("sanitize");
require("dotenv").config();
const requestIp = require("request-ip");

const port = process.env.PORT || 8001;

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;
const collectionName = process.env.MONGODB_COLLECTION_NAME;
const workExperiences = [
  "LikeMindedLab",
  "Stingray",
  "Dakis",
  "OrangeTango",
  "OneProvider",
];

const app = express();

app.use(sanitize.middleware);
app.set("view engine", "ejs");
app.use(express.static(__dirname));

app.get("/", (req, res) => res.render("index"));
app.get("/home", (req, res) => res.render("index"));
app.get("/asciiMe", (req, res) => res.render("asciiMe"));
app.get("/works", async (req, res) => {
  const client = new MongoClient(uri);
  const clientIp = requestIp.getClientIp(req);
  let documents = {};
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    const collection = client.db(dbName).collection(collectionName);
    tmpDocuments = await collection
      .find({ ip: clientIp }, { projection: { _id: 0, ip: 0 } })
      .toArray();
    for (const document of tmpDocuments) {
      documents[document.workExperience] = document.vote;
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
  return res.render("works", { workExperiences: documents });
});

app.get("/projectTarget", (req, res) => res.render("game"));

app.put("/api/vote", async (req, res) => {
  const clientIp = requestIp.getClientIp(req);
  const vote = req.queryInt("vote");
  const workExperience = req.queryString("workExperience");
  if (clientIp && workExperiences.includes(workExperience)) {
    const client = new MongoClient(uri);

    try {
      await client.connect();
      const collection = client.db(dbName).collection(collectionName);
      const query = { ip: clientIp, workExperience: workExperience };
      const update = {
        $set: {
          ip: clientIp,
          workExperience: workExperience,
          vote: vote === 1 ? 1 : -1,
        },
      };
      await collection.updateOne(query, update, { upsert: true });
    } catch (e) {
        console.log(e);
      await client.close();
      return res.status(500).json("Error from our side please try again");
    }
    await client.close();
    return res.status(200).json("Success!");
  }
  return res.status(400).json("Parameters are not correctly sets");
});

app.use(function (req, res) {
  res.render("index");
});

const server = app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

module.exports = server;
