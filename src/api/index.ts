import { Elysia } from "elysia";

const api = new Elysia()
    .group('/api', (app) =>
        app
            .get("/", () => "Hello Elysia from API")
            .get("/scores", async ({ db }) => {
                const result = await db.getScores();
                return JSON.stringify(result);
            })
            .get("/users", async ({ db }) => {
                const result = await db.getUsers();
                return JSON.stringify(result);
            })
            .post("/new-user", async ({ db, query }) => {
                const result = await db.addUser(query.name);
                return JSON.stringify(result);
            })
            .get("/update-user", async ({ db, query }) => {
                const result = await db.updateUser(query.newName, query.oldName);
                return JSON.stringify(result);
            })
            .get("/game-result", async ({ db, query }) => {
                console.log(`/api/game-result: ${query.timeCompleted} ${query.name} ${query.playerID}`);
                const result = await db.addScore(query.timeCompleted, query.name);
                return JSON.stringify(result);
            })
            .get("/delete-score", async ({ db, query }) => {
                console.log(`/api/delete-score: ${query.scoreID}`);
                const result = await db.deleteScore(query.scoreID);
                return JSON.stringify(result);
            })

    );

export default api;