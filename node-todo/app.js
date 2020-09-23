import express from "express"
import bodyParser from "body-parser"
import {registerRoutes} from "./routes/todoRoutes.js";

export const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.raw());
registerRoutes(app);