import {deleteTodoById} from "../data/dataHandler.js";

export const deleteTodo = async (req, res) => {
    let {id} = req.params;
    let responseContent;
    let statusCode;
    try {
        await deleteTodoById(id);
        statusCode = 200;
    } catch (e) {
        responseContent = {
            errorMessage: e.message
        };
        statusCode = 400;
    }
    res.status(statusCode);
    res.send(responseContent);
};