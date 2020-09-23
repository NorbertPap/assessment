import {getAllTodoItems} from "../data/dataHandler.js";

export const getTodos = async (req, res) => {
    let statusCode;
    let responseContent;
    try{
        statusCode = 200;
        responseContent = JSON.stringify(await getAllTodoItems());
    } catch (e) {
        statusCode = 500;
        responseContent = {
            errorMessage: e.message
        };
    }
    res.status(statusCode);
    res.send(responseContent)
};