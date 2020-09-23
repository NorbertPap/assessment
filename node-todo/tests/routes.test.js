import request from "supertest"
import {app} from "../app.js"

test("Get the array of todos", async () => {
    const response = await request(app).get("/todos");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({todos:[]});
});
