const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require('path');
app.use(bodyParser.json());

// Set EJS as view engine
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

const { Todo } = require("./models");

// Root route to render index.ejs with todos
app.get("/", async (request, response) => {
  try {
    const allTodos = await Todo.findAll(); // Fetch all todos from the database
    response.render("index", { allTodos }); // Pass todos to the template
  } catch (error) {
    console.error("Error fetching todos:", error);
    response.status(500).send("Internal Server Error");
  }
});

// eslint-disable-next-line no-unused-vars
app.get("/todos", (request, response) => {
  console.log("Todo list");
});

app.post("/todos", async (request, response) => {
  console.log("Creating a todo", request.body);
  try {
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
    });
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});


// PUT http://mytodoapp.com/todos/123/markAsCompleted
app.put("/todos/:id/markAsCompleted", async (request, response) => {
  console.log("We have to update a todo with ID:", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

// eslint-disable-next-line no-unused-vars
app.delete("/todos/:id", (request, response) => {
  console.log("Delete a todo by ID: ", request.params.id);
});

//deleting todo by id
app.delete("/todos/:id/DeleteTodoById", async (request, response) => {
  console.log("We have to delete a todo with ID:", request.params.id);

  try {
    // Find the specific todo by ID
    const todo = await Todo.findByPk(request.params.id);

    if (!todo) {
      return response.status(404).json({ message: "Todo not found" });
    }

    // Call the instance method to delete the todo
    const result = await todo.DeleteTodoById();
    return response.json(result);
  } catch (error) {
    console.error("Error deleting todo:", error.message);
    return response.status(500).json({ error: "Internal Server Error" });
  }
});



module.exports = app;
