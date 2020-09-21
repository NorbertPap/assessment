import app from "../todoServer"
import {getTodos} from "../controllers/getTodos";
import {newTodo} from "../controllers/newTodo";
import {getTodo} from "../controllers/getTodo";
import {updateTodo} from "../controllers/updateTodo";
import {deleteTodo} from "../controllers/deleteTodo";

app.route("/todos")
    .get(getTodos)
    .post(newTodo);

app.route("/todos/:id")
    .get(getTodo)
    .put(updateTodo)
    .delete(deleteTodo);