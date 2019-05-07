const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/todo-app", {
  useNewUrlParser: true
});

const Todo = mongoose.model("Todo", {
  title: {
    type: String,
    default: ""
  },
  done: {
    type: Boolean,
    default: false
  }
});

// Create
app.post("/create", async (req, res) => {
  try {
    const newTodo = new Todo({
      title: req.body.title
      //done: req.body.done ? req.body.done : false
    });
    await newTodo.save();
    return res.json({
      message: "Todo created : " + req.body.title + " / id : " + newTodo._id
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Read
app.get("/", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update
app.post("/update", async (req, res) => {
  try {
    if (req.body.id && req.body.done !== undefined) {
      const todo = await Todo.findOne({ _id: req.body.id });
      // Autre manière de trouver un document à partir d'un `id` :
      // const student = await Student.findById(req.body.id);
      todo.done = req.body.done;
      await todo.save();
      res.json({
        message: "Todo updated : " + todo.title + " done : " + todo.done
      });
    } else {
      res.status(400).json({ message: "Missing parameter" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete
app.post("/delete", async (req, res) => {
  try {
    if (req.body.id) {
      const todo = await Todo.findOne({ _id: req.body.id });
      // Autre manière de trouver un document à partir d'un `id` :
      // const student = await Student.findById(req.body.id);
      await todo.remove();
      res.json({
        message: "Todo removed : " + todo.title + " / " + req.body.id
      });
    } else {
      res.status(400).json({ message: "Missing id" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Welcome !!! Todo server started ...");
});
