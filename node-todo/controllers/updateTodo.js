import {updateTodoById} from "../data/dataHandler.js";

export const updateTodo = async (req, res) => {
    let {id} = req.params;
    let responseContent;
    let statusCode;
    try {
        responseContent = await updateTodoById(id, req.body);
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