import express from "express";
import bodyParser from "body-parser";
import {registerRoutes} from "./routes/todoRoutes.js";
import {cleanUpDoneTodos} from "./data/dataHandler.js";

export const app = express();
const port = 3000;

function setUpCleanUpSchedule() {
    const FIVE_MINUTES = 300000; // in milliseconds
    setInterval(() => {
        cleanUpDoneTodos();
    }, FIVE_MINUTES);
}

function main() {
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(bodyParser.raw());

    registerRoutes(app);

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });


    setUpCleanUpSchedule();
}

main();