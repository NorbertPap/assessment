import {deleteTodoById} from "../data/dataHandler.js";
import {ResourceNotFoundError} from "../errors/ResourceNotFoundError.js";

export const deleteTodo = async (req, res) => {
    let {id} = req.params;
    let responseContent;
    let statusCode;
    try {
        await deleteTodoById(id);
        statusCode = 200;
    } catch (e) {
        // error can be:
        // 1. id doesn't exist -> Not Found
        // 2. file system problem -> Internal Server Error
        if(e instanceof ResourceNotFoundError) {
            statusCode = 404;
        } else {
            statusCode = 500
        }
        responseContent = {
            errorMessage: e.message
        };
    }
    res.status(statusCode);
    res.json(responseContent);
};