import fs from "fs/promises"
import {addNewTodoItem, deleteTodoById, getAllTodoItems, getTodoById, updateTodoById} from "../data/dataHandler";

jest.mock("fs/promises");

test("Get all todos", async () => {
    fs.readFile.mockResolvedValue(`{"todos": [{"id": "1", "text":"text", "priority": 5, "done": false}]}`);
    expect(await getAllTodoItems()).toEqual({todos: [{id: "1", text:"text", priority: 5, done: false}]});
});

test("Add new todo item: correct data", async () => {
    fs.readFile.mockResolvedValue(JSON.stringify({todos: []}));
    await addNewTodoItem({text: "text", priority: 2, done: true});
    let todosObject = JSON.parse(fs.writeFile.mock.calls[0][1]);
    expect(todosObject.todos[0].text).toBe("text");
    expect(todosObject.todos[0].priority).toBe(2);
    expect(todosObject.todos[0].done).toBe(true);
});

test("Add new todo item: correct data 2", async () => {
    fs.readFile.mockResolvedValue(JSON.stringify({todos: []}));
    await addNewTodoItem({text: "text"});
    let todosObject = JSON.parse(fs.writeFile.mock.calls[0][1]);
    expect(todosObject.todos[0].text).toBe("text");
    expect(todosObject.todos[0].priority).toBe(3);
    expect(todosObject.todos[0].done).toBe(false);
});

test("Add new todo item: incorrect data", async () => {
    fs.readFile.mockResolvedValue(JSON.stringify({todos: []}));
    try {
        await addNewTodoItem({priority: 5, done: true});
    } catch (e) {
        expect(e.name).toEqual("ValidationError");
    }
});

test("Find todo by id: existing id", async () => {
    fs.readFile.mockResolvedValue(JSON.stringify({
        todos: [
            {
                id: "1",
                text: "text1",
                priority: 1,
                done: false
            },
            {
                id: "2",
                text: "text2",
                priority: 2,
                done: false
            },
            {
                id: "3",
                text: "text3",
                priority: 3,
                done: false
            }
        ]
    }));
    expect(await getTodoById("3")).toEqual({id: "3", text: "text3", priority: 3, done: false});
});

test("Find todo by id: non-existent id", async () => {
    fs.readFile.mockResolvedValue(JSON.stringify({
        todos: [
            {
                id: "1",
                text: "text1",
                priority: 1,
                done: false
            },
            {
                id: "2",
                text: "text2",
                priority: 2,
                done: false
            },
            {
                id: "3",
                text: "text3",
                priority: 3,
                done: false
            }
        ]
    }));
    try {
        await getTodoById("3");
    } catch (e) {
        expect(e.name).toEqual("ResourceNotFoundError");
    }
});

test("Delete todo by id: existing id", async () => {
    fs.readFile.mockResolvedValue(JSON.stringify({
        todos: [
            {
                id: "1",
                text: "text1",
                priority: 1,
                done: false
            },
            {
                id: "2",
                text: "text2",
                priority: 2,
                done: false
            },
            {
                id: "3",
                text: "text3",
                priority: 3,
                done: false
            }
        ]
    }));

    await deleteTodoById("3");
    expect(fs.writeFile.mock.calls[0][1]).toEqual(JSON.stringify({
        todos: [
            {
                id: "1",
                text: "text1",
                priority: 1,
                done: false
            },
            {
                id: "2",
                text: "text2",
                priority: 2,
                done: false
            }
        ]
    }));
});

test("Delete todo by id: non-existent id", async () => {
    fs.readFile.mockResolvedValue(JSON.stringify({
        todos: [
            {
                id: "1",
                text: "text1",
                priority: 1,
                done: false
            },
            {
                id: "2",
                text: "text2",
                priority: 2,
                done: false
            },
            {
                id: "3",
                text: "text3",
                priority: 3,
                done: false
            }
        ]
    }));

    try {
        await deleteTodoById("4");
    } catch (e) {
        expect(e.name).toEqual("ResourceNotFoundError");
    }
});

test("Update todo by id: existing id and correct data", async () => {
    fs.readFile.mockResolvedValue(JSON.stringify({
        todos: [
            {
                id: "1",
                text: "text1",
                priority: 1,
                done: false
            }
        ]}));
    await updateTodoById("1", {text: "text", priority: 2, done: true});
    expect(fs.writeFile.mock.calls[0][1]).toEqual(JSON.stringify({
        todos: [
            {
                id: "1",
                text: "text",
                priority: 2,
                done: true
            }
        ]
    }));
});

test("Update todo by id: non-existent id", async () => {
    fs.readFile.mockResolvedValue(JSON.stringify({
        todos: [
            {
                id: "1",
                text: "text1",
                priority: 1,
                done: false
            }
        ]}));
    try {
        await updateTodoById("2", {text: "text", priority: 2, done: true})
    } catch (e) {
        expect(e.name).toBe("ResourceNotFoundError")
    }
});

test("Update todo by id: existing id and incorrect data", async () => {
    fs.readFile.mockResolvedValue(JSON.stringify({
        todos: [
            {
                id: "1",
                text: "text1",
                priority: 1,
                done: false
            }
        ]}));
    try {
        await updateTodoById("1", {text: "text", done: "true"})
    } catch (e) {
        expect(e.name).toBe("ValidationError")
    }
});
