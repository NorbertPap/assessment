import {getAllTodoItems} from "../data/dataHandler.js";

export const getTodos = async (req, res) => {
    let responseContent;
    let statusCode;
    try{
        responseContent = JSON.stringify(await getAllTodoItems());
        statusCode = 200;
    } catch (e) {
        // error can be: file system problem -> Internal Server Error
        responseContent = {
            errorMessage: e.message
        };
        statusCode = 500;
    }
    res.status(statusCode);
    res.send(responseContent)
};