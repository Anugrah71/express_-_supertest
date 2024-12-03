const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// Set EJS as view engine
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

const { Todo } = require("./models");

// Root route to render index.ejs with todos
app.get("/", async (request, response) => {
  try {
    const allTodos = await Todo.findAll(); // Fetch all todos from the database

    // Get today's date
    const today = new Date().toISOString().split("T")[0];

    // Categorize todos
    const overdue = allTodos.filter((todo) => todo.dueDate < today);
    const dueToday = allTodos.filter((todo) => todo.dueDate === today);
    const dueLater = allTodos.filter((todo) => todo.dueDate > today);
    let overcount = overdue.length;
    let duetocount = dueToday.length;
    let duelatecount = dueLater.length;
    if(request.accepts("html")){ 
    response.render("index", {
      overdue,
      dueToday,
      dueLater,
      overcount,
      duetocount,
      duelatecount,
      
    });
   }else{
    response.json({
      overdue,
      dueToday,
      dueLater,
    })
  }} catch (error) {
    console.error("Error fetching todos:", error);
    response.status(500).send("Internal Server Error");
  }
});

// eslint-disable-next-line no-unused-vars
// send all todo to the client
app.get("/todos", async (request, response) => {
  console.log("Todo list");
  try {
    const allTodos = await Todo.getAllTodos();
    response.status(200).json(allTodos);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

//create a new todo
app.post("/todos", async (request, response) => {
  console.log("Creating a todo", request.body);
  try {
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

// PUT http://mytodoapp.com/todos/123/markAsCompleted
// Mark a todo as completed
app.put("/todos/:id/markAsCompleted", async (request, response) => {
  console.log("We have to update a todo with ID:", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  if (!todo) {
    return response.status(404).json({ message: "Todo not found" });
  }
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

//deleting todo by id
app.delete("/todos/:id", async (request, response) => {
  console.log("Deleting Todo with ID:", request.params.id);

  try {
    await Todo.remove(request.params.id);
    return response.json(true);
  } catch (error) {
    return response.status(422).json(error);
  }
});

module.exports = app;
