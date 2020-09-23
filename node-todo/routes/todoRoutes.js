import {getTodos} from "../controllers/getTodos.js";
import {newTodo} from "../controllers/newTodo.js";
import {getTodo} from "../controllers/getTodo.js";
import {updateTodo} from "../controllers/updateTodo.js";
import {deleteTodo} from "../controllers/deleteTodo.js";

export function registerRoutes(app) {
    app.get("/todos", getTodos);
    app.post("/todos", newTodo);

    app.get("/todos/:id", getTodo);
    app.put("/todos/:id", updateTodo);
    app.delete("/todos/:id", deleteTodo);
}
