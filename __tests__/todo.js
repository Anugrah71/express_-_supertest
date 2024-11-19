const request = require('supertest');
const app = require('../app'); // Adjust the path as necessary
const { sequelize, Todo } = require('../models'); // Adjust the path as necessary

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Recreate the database schema
});

afterAll(async () => {
  await sequelize.close(); // Close the database connection
});

describe("Todo API", () => {
  test("responds with json at /todos", async () => {
    const response = await request(app)
      .post('/todos')
      .send({
        title: "Buy milk",
        dueDate: new Date().toISOString(),
        completed: false
      });
    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toBe("application/json; charset=utf-8");
    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.id).toBeDefined();
  });

  test("Mark a todo as complete", async () => {
    const response = await request(app).post('/todos').send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false
    });
    const parsedResponse = JSON.parse(response.text);
    const todoID = parsedResponse.id;

    expect(parsedResponse.completed).toBe(false);

    const markAsCompleteResponse = await request(app).put(`/todos/${todoID}/markAsComplete`).send();
    const parseUpdateResponse = JSON.parse(markAsCompleteResponse.text);
    expect(parseUpdateResponse.completed).toBe(true);
  });

  test("Delete a todo by id", async () => {
    const response = await request(app).post('/todos').send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false
    });
    const parsedResponse = JSON.parse(response.text);
    const todoID = parsedResponse.id;

    const deleteResponse = await request(app).delete(`/todos/${todoID}`).send();
    expect(deleteResponse.statusCode).toBe(200);
    expect(deleteResponse.body).toBe(true);

    const getResponse = await request(app).get(`/todos/${todoID}`).send();
    expect(getResponse.statusCode).toBe(404);
  });
});
