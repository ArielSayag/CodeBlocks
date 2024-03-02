const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs').promises;
const dotenv = require('dotenv')
dotenv.config()
const cors = require('cors')
const app = express();
const port = process.env.PORT || 80
const server = http.createServer(app);


const { WebSocketServer } = require('ws');
const CodeBlocksManager = require('./CodeBlocksManager');
const CodeQuestion = require('./models/CodeQuestion');
const CodeSolution = require('./models/CodeSolution');

const webSocketServer = new WebSocketServer({server});

const codeBlocksManager = new CodeBlocksManager()

webSocketServer.on("connection", codeBlocksManager.handleConnection.bind(codeBlocksManager))

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.json())
app.use(cors())



app.get("/questions", async (req,res) => {
  try {
      const questions = await CodeQuestion.find({})
      return res.status(200).json(questions)
  } catch(e) {
    return res.status(500).json(e.message)
  }
})


app.get("/question/:id", async (req,res) => {
  try {
    const {id } = req.params
      const question = await CodeQuestion.findById(id)
      return res.status(200).json(question)
  } catch(e) {
    return res.status(500).json(e.message)
  }
})

// update code by student 
app.post("/question", async (req,res)=>{
  try{
    const updateCode = req.body;
    const updatedData = await CodeSolution.create(updateCode)
    if (!updatedData) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.json(updatedData);

  }catch(e){
    console.error(err);
  }
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "views", 'index.html'));
});

module.exports = app

server.listen(port, () => {
  const db = require('./db')

  console.log(`Server running at http://localhost:${port}/`);
});


