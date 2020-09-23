import fs from "fs/promises";
import shortid from "shortid";
import {ValidationError} from "../errors/ValidationError.js";
import {ResourceNotFoundError} from "../errors/ResourceNotFoundError.js";

const fileName = "./data/todos.json";

export async function getAllTodoItems() {
    return JSON.parse(await fs.readFile(fileName));
}

async function saveTodoItems(todosObject) {
    fs.writeFile(fileName, JSON.stringify(todosObject));
}

export async function addNewTodoItem(todo) {
    let newItem = createNewTodoFromRequest(todo);
    let todosObject = await getAllTodoItems();
    todosObject.todos.push(newItem);
    await saveTodoItems(todosObject);
}

function createNewTodoFromRequest(todo) {
    let {text, priority, done} = extractDataForNewTodo(todo);
    return {
        id: generateNewId(),
        text: text,
        priority: priority,
        done: done
    };
}

function extractDataForNewTodo(todo) {
    let {text, priority, done} = todo;
    validateExistingFieldTypes(text, priority, done);
    if (text === undefined) {
        throw new ValidationError("Text was not set for todo. Please specify text before posting new todo");
    }
    if (priority === undefined || priority < 1 || priority > 5 || typeof priority !== "number") {
        priority = 3;
    }
    if (done === undefined || typeof done !== "boolean") {
        done = false;
    }
    return {text, priority, done};
}

function validateExistingFieldTypes(text, priority, done) {
    if(text !== undefined && typeof text !== "string" ||
        priority !== undefined &&typeof priority !== "number" ||
        done !== undefined && typeof done !== "boolean") {
        throw new ValidationError("Incorrect format for todo item.");
    }
}

function generateNewId() {
    return shortid.generate();
}

export async function getTodoById(id) {
    let {todos} = await getAllTodoItems();
    return findTodoById(todos, id);
}

export async function deleteTodoById(id) {
    let todosObject = await getAllTodoItems();
    let {todos} = todosObject;
    let todoItemToBeDeleted = findTodoById(todos, id);

    todosObject.todos = todos.filter((todo) => {
        return todo !== todoItemToBeDeleted
    });

    await saveTodoItems(todosObject);
}

export async function updateTodoById(id, todo) {
    let todosObject = await getAllTodoItems();
    let {todos} = todosObject;
    let todoItemToBeUpdated = findTodoById(todos, id);
    let {text, priority, done} = todo;
    validateExistingFieldTypes(text, priority, done);

    if(text !== undefined && typeof text === "string") {
        todoItemToBeUpdated.text = text;
    }
    if(priority !== undefined && typeof priority === "number") {
        todoItemToBeUpdated.priority = priority;
    }
    if(done !== undefined && typeof done === "boolean") {
        todoItemToBeUpdated.done = done;
    }

    await saveTodoItems(todosObject);
    return todoItemToBeUpdated;
}

function findTodoById(todos, id) {
    let todoToFind;

    for (let todo of todos) {
        if (todo.id === id) {
            todoToFind = todo;
            break;
        }
    }

    if (!todoToFind) {
        throw new ResourceNotFoundError(`Could not find todo with an id of: ${id}`)
    }

    return todoToFind;
}

export async function cleanUpDoneTodos() {
    let todosObject = await getAllTodoItems();
    todosObject.todos = todosObject.todos.filter((todo) => {
        return !todo.done;
    });
    await saveTodoItems(todosObject);
}
