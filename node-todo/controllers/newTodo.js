import {addNewTodoItem} from "../data/dataHandler.js";

export const newTodo = async (req, res) => {
    let responseContent;
    let statusCode;
    try{
        await addNewTodoItem(req.body);
        statusCode = 201; // Created resource
    } catch (e) {
        responseContent = {
            errorMessage: e.message
        };
        statusCode = 400;
    }
    res.status(statusCode);
    res.send(responseContent);
};