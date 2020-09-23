import {addNewTodoItem} from "../data/dataHandler.js";

export const newTodo = async (req, res) => {
    let statusCode;
    let responseContent;
    try{
        await addNewTodoItem(req.body);
        statusCode = 201; // Created resource
    } catch (e) {
        statusCode = 400;
        responseContent = {
            errorMessage: e.message
        };
    }
    res.status(statusCode);
    res.send(responseContent);
};