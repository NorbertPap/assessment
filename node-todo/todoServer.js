import express from "express";
import bodyParser from "body-parser";
import {registerRoutes} from "./routes/todoRoutes.js";


export const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

registerRoutes(app);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});