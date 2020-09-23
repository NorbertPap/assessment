import {cleanUpDoneTodos} from "./data/dataHandler.js";
import {app} from "./app.js"

const port = 3000;

function setUpCleanUpSchedule() {
    const FIVE_MINUTES = 300000; // in milliseconds
    setInterval(() => {
        cleanUpDoneTodos();
    }, FIVE_MINUTES);
}

function main() {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });

    setUpCleanUpSchedule();
}

main();