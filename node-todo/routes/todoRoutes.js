import {getTodos} from "../controllers/getTodos.js";
import {newTodo} from "../controllers/newTodo.js";
import {getTodo} from "../controllers/getTodo.js";
import {updateTodo} from "../controllers/updateTodo.js";
import {deleteTodo} from "../controllers/deleteTodo.js";

export function registerRoutes(app) {
    app.route("/todos")
        .get(getTodos)
        .post(newTodo);

    app.route("/todos/:id")
        .get(getTodo)
        .put(updateTodo)
        .delete(deleteTodo);
}
