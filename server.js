/*const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, Node.js HTTP Server");
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
*/
const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

app.use(express.json());

const corsOptions = {
  origin: "*", // Replace with your domain
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// connect to the MongoDB database
mongoose.connect(
  `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.nkupy.mongodb.net/toybox-database?retryWrites=true&w=majority&appName=Cluster0`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", () => {
  console.log("Connected to the database");
});

// define a schema for your data
const toySchema = new mongoose.Schema({
  color: String,
});

// create a model from the schema
const Toy = mongoose.model("Toy", toySchema);

// Toy box (dummy data) - represents a database
/*
let toyBox = [
  { id: 1, color: "red" },
  { id: 2, color: "blue" },
];
*/

// Create a new toy box in the database - POST request
/*
app.post("/blocks", (req, res) => {
  const newBlock = req.body; // the new block coming from the frontend
  toyBox.push({ id: toyBox.length + 1, color: newBlock.color });
  res.json({ id: toyBox.length + 1, color: newBlock.color }); // the response that will be sent back to the frontend
});
*/
app.post("/blocks", async (req, res) => {
  const newBlock = req.body; // the new block coming from the frontend
  try {
    const savedToy = await Toy.create(newBlock);
    res.json(savedToy);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get all the toys in the database - GET request
/*
app.get("/blocks", (req, res) => {
  res.json(toyBox);
});
*/
app.get("/blocks", async (req, res) => {
  try {
    const toys = await Toy.find({});
    res.json(toys);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// update a particular toy box - PUT request
/*
app.put("/blocks/:id", (req, res) => {
  const blockId = parseInt(req.params.id);
  const updatedBlock = req.body;
  toyBox = toyBox.map((block) => (block.id === blockId ? updatedBlock : block));
  res.json(updatedBlock);
});
*/
app.put("/blocks/:id", async (req, res) => {
  const blockId = req.params.id;

  try {
    const updatedBlock = await Toy.findByIdAndUpdate(blockId, req.body);
    if (!updatedBlock) {
      res.send.status(404).send("Toy block not found");
    }
    res.json(updatedBlock);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// delete a particular toy box - DELETE request
/*
app.delete("/blocks/:id", (req, res) => {
  const blockId = parseInt(req.params.id);
  toyBox = toyBox.filter((block) => block.id !== blockId);
  res.json({ message: "Block toy removed" });
});
*/
app.delete("/blocks/:id", async (req, res) => {
  const blockId = req.params.id;
  try {
    const deletedBlock = await Toy.findByIdAndDelete(blockId);

    if (!deletedBlock) {
      res.send.status(404).send("Toy block not found");
    }
    res.json({ message: "Toy block successfully removed" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
