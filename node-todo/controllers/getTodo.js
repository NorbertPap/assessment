import {getTodoById} from "../data/dataHandler.js";

export const getTodo = async (req, res) => {
    let {id} = req.params;
    let responseContent;
    let statusCode;
    try {
        responseContent = await getTodoById(id);
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