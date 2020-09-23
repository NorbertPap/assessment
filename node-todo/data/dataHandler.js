import fs from "fs/promises";
import shortid from "shortid";

const fileName = "./data/todos.json";

export async function getAllTodoItems() {
    return JSON.parse(await fs.readFile(fileName));
}

export async function addNewTodoItem(todo) {
    let newItem = createNewTodoFromRequest(todo);

    let todosObject = await getAllTodoItems();
    todosObject.todos.push(newItem);
    await fs.writeFile(fileName, JSON.stringify(todosObject));
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
    if (text === undefined) {
        throw new Error("Text was not set for todo. Please specify text before posting new todo");
    }
    if (priority === undefined) {
        priority = 3;
    }
    if (done === undefined) {
        done = false;
    }
    return {text, priority, done};
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

    await fs.writeFile(fileName, JSON.stringify(todosObject));
}

export async function updateTodoById(id, todo) {
    let todosObject = await getAllTodoItems();
    let {todos} = todosObject;
    let todoItemToBeUpdated = findTodoById(todos, id);
    let {text, priority, done} = todo;

    if(text !== undefined) {
        todoItemToBeUpdated.text = text;
    }
    if(priority !== undefined) {
        todoItemToBeUpdated.priority = priority;
    }
    if(done !== undefined) {
        todoItemToBeUpdated.done = done;
    }

    await fs.writeFile(fileName, JSON.stringify(todosObject));
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
        throw new Error(`Could not find todo with an id of: ${id}`)
    }

    return todoToFind;
}
