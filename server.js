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

app.use(express.json());

const corsOptions = {
  origin: "*", // Replace with your domain
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Toy box (dummy data) - represents a database
let toyBox = [
  { id: 1, color: "red" },
  { id: 2, color: "blue" },
];

// Create a new toy box in the database - POST request
app.post("/blocks", (req, res) => {
  const newBlock = req.body; // the new block coming from the frontend
  toyBox.push({ id: toyBox.length + 1, color: newBlock.color });
  res.json({ id: toyBox.length + 1, color: newBlock.color }); // the response that will be sent back to the frontend
});

// Get all the toys in the database - GET request
app.get("/blocks", (req, res) => {
  res.json(toyBox);
});

// update a particular toy box - PUT request
app.put("/blocks/:id", (req, res) => {
  const blockId = parseInt(req.params.id);
  const updatedBlock = req.body;
  toyBox = toyBox.map((block) => (block.id === blockId ? updatedBlock : block));
  res.json(updatedBlock);
});

// delete a particular toy box - DELETE request
app.delete("/blocks/:id", (req, res) => {
  const blockId = parseInt(req.params.id);
  toyBox = toyBox.filter((block) => block.id !== blockId);
  res.json({ message: "Block toy removed" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
