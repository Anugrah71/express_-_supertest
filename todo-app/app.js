const express = require('express');
const bodyParser = require('body-parser');
const { Todo } = require('./models');

const app = express();
app.use(bodyParser.json());

app.get("/", (request, response) => {
    response.send("Hello World");
});

app.post("/todos", async (request, response) => {
    try {
        const todo = await Todo.create({
            title: request.body.title,
            dueDate: request.body.dueDate,
            completed: false
        });
        return response.status(200).json(todo);
    } catch (error) {
        return response.status(422).json({ error });
    }
});

app.get("/todos", async (request, response) => {
    try {
        const todos = await Todo.findAll();
        return response.status(200).json(todos);
    } catch (error) {
        return response.status(500).json({ error });
    }
});

app.delete("/todos/:id", async (request, response) => {
    try {
        const result = await Todo.destroy({ where: { id: request.params.id } });
        return response.status(200).json(result ? true : false);
    } catch (error) {
        return response.status(500).json({ error });
    }
});

app.put("/todos/:id/markAsComplete", async (request, response) => {
    try {
        const todo = await Todo.findByPk(request.params.id);
        if (!todo) {
            return response.status(404).json({ error: "Todo not found" });
        }
        todo.completed = true;
        await todo.save();
        return response.json(todo);
    } catch (error) {
        return response.status(422).json({ error });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app; // Export the app for testing