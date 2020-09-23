import {addNewTodoItem} from "../data/dataHandler.js";
import {ValidationError} from "../errors/ValidationError.js";

export const newTodo = async (req, res) => {
    let responseContent;
    let statusCode;
    try{
        await addNewTodoItem(req.body);
        statusCode = 201; // Created resource
    } catch (e) {
        // error can be:
        // 1. to-do format error -> Bad Request
        // 2. file system problem -> Internal Server Error
        if(e instanceof ValidationError) {
            statusCode = 400;
        } else {
            statusCode = 500;
        }
        responseContent = {
            errorMessage: e.message
        };
    }
    res.status(statusCode);
    res.send(responseContent);
};