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