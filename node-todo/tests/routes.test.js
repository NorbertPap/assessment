import request from "supertest"
import {app} from "../app.js"
import {ResourceNotFoundError} from "../errors/ResourceNotFoundError";
import {getTodoById, addNewTodoItem, deleteTodoById, getAllTodoItems, updateTodoById} from "../data/dataHandler";
import {ValidationError} from "../errors/ValidationError";

jest.mock("../data/dataHandler.js");

// GET /todos
test("Get the array of todos", async () => {
    getAllTodoItems.mockResolvedValue({todos: []});
    const response = await request(app).get("/todos");
    expect(response.statusCode).toBe(200);
    expect(response.body.todos).toBeDefined();
    expect(response.body.todos.length).toBeGreaterThanOrEqual(0);
});

test("Get the array of todos: server error", async () => {
    getAllTodoItems.mockImplementation(() => {throw new Error("errorMessage")});
    const response = await request(app).get("/todos");
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({errorMessage: "errorMessage"});
});

// GET /todos/:id
test("Get todo by id: existing id", async () => {
    getTodoById.mockResolvedValue({id:"mock", text: "Stay hard", priority: 5, done: false});
    const response = await request(app).get("/todos/mock");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({id:"mock", text: "Stay hard", priority: 5, done: false});
});

test("Get todo by id: non-existent id", async () => {
    getTodoById.mockImplementation(() => {throw new ResourceNotFoundError(`Could not find todo with an id of: mock`)});
    const response = await request(app).get("/todos/mock");
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({errorMessage: `Could not find todo with an id of: mock`});
});

test("Get todo by id: server error", async () => {
    getTodoById.mockImplementation(() => {throw new Error("errorMessage")});
    const response = await request(app).get("/todos/mock");
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({errorMessage: "errorMessage"});
});

// POST /todos
test("Create new todo", async () => {
    addNewTodoItem.mockResolvedValue(undefined);
    const response = await request(app).post("/todos");
    expect(response.statusCode).toBe(201);
    expect(addNewTodoItem.mock.calls.length).toBe(1);
});

test("Create new todo: validation error", async () => {
    addNewTodoItem.mockImplementation(() => {throw new ValidationError("Text was not set for todo. Please specify text before posting new todo")});
    const response = await request(app).post("/todos");
    expect(response.statusCode).toBe(400);
    expect(addNewTodoItem.mock.calls.length).toBe(1);
});

test("Create new todo: validation error 2", async () => {
    addNewTodoItem.mockImplementation(() => {throw new ValidationError("Incorrect format for todo item.")});
    const response = await request(app).post("/todos");
    expect(response.statusCode).toBe(400);
    expect(addNewTodoItem.mock.calls.length).toBe(1);
});

test("Create new todo: server error", async () => {
    addNewTodoItem.mockImplementation(() => {throw new Error("errorMessage")});
    const response = await request(app).post("/todos");
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({errorMessage: "errorMessage"});
});

// PUT /todos/:id
test("Update todo: correct id and new data", async () => {
    let body = {text: "Stay hard", priority: 5, done: false};
    updateTodoById.mockResolvedValue({id: "mock", text: {body}, priority: {body}, done: {body}});
    const response = await request(app).put("/todos/mock").send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({id: "mock", text: {body}, priority: {body}, done: {body}});
});

test("Update todo: incorrect id", async () => {
    let body = {text: "Stay hard", priority: 5, done: false};
    updateTodoById.mockImplementation(() => {throw new ResourceNotFoundError(`Could not find todo with an id of: mock`)});
    const response = await request(app).put("/todos/mock").send(body);
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({errorMessage: `Could not find todo with an id of: mock`});
});

test("Update todo: server error", async () => {
    updateTodoById.mockImplementation(() => {throw new Error("errorMessage")});
    const response = await request(app).put("/todos/mock");
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({errorMessage: "errorMessage"});
});

// DELETE /todos/:id
test("Delete todo: correct id", async () => {
    deleteTodoById.mockResolvedValue(undefined);
    const response = await request(app).delete("/todos/mock");
    expect(response.statusCode).toBe(200);
    expect(deleteTodoById.mock.calls.length).toBe(1);
});

test("Delete todo: incorrect id", async () => {
    deleteTodoById.mockImplementation(() => {throw new ResourceNotFoundError(`Could not find todo with an id of: mock`)});
    const response = await request(app).delete("/todos/mock");
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({errorMessage: `Could not find todo with an id of: mock`});
});

test("Delete todo: server error", async () => {
    deleteTodoById.mockImplementation(() => {throw new Error("errorMessage")});
    const response = await request(app).delete("/todos/mock");
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({errorMessage: "errorMessage"});
});
