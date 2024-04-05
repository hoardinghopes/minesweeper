import { Elysia, t } from "elysia";
import { MinesweeperDB } from "../db";

const api = new Elysia()
    .decorate('db', new MinesweeperDB())
    .group('/api', (app) =>
        app
            .get("/", ({ set }) => {
                set.redirect = '/'
            }, { detail: { summary: "Minesweeper API" } })
            .group("scores", (app) =>
                app
                    .get("/", async ({ db }) => {
                        const result = await db.getScores();
                        return JSON.stringify(result);
                    })

                    .get("/new", async ({ db, query: { timeCompleted, userID } }) => {
                        const id = Number(userID);
                        const score = Number(timeCompleted);
                        if (!id) {
                            return JSON.stringify({ error: "No userID integer provided" });
                        }
                        if (!timeCompleted) {
                            return JSON.stringify({ error: "No timeCompleted integer provided" });
                        }

                        const user = await db.getUser(id);
                        if (!user) {
                            return JSON.stringify({ error: "User not found" });
                        }

                        const result = await db.addScore(score, id);
                        return JSON.stringify(result);
                    },
                        { query: t.Object({ timeCompleted: t.String(), userID: t.String() }) })

                    .get("/delete", async ({ db, query: { scoreID } }) => {
                        const id = Number(scoreID);
                        if (!id) {
                            return JSON.stringify({ error: "No scoreID integer provided" });
                        }
                        console.log(`/api/scores/delete: ${scoreID}`);
                        const result = await db.deleteScore(id);
                        return JSON.stringify(result);
                    },
                        { query: t.Object({ scoreID: t.String() }) })
            )
            .group("users", (app) =>
                app
                    .get("/", async ({ db }) => {
                        const result = await db.getUsers();
                        return JSON.stringify(result);
                    })

                    .post("/new", async ({ db, query: { name } }) => {
                        if (!name) {
                            return JSON.stringify({ error: "No name provided" });
                        }
                        const result = await db.addUser(name);
                        return JSON.stringify(result);
                    },
                        { query: t.Object({ name: t.String() }) })

                    .get("/update", async ({ db, query: { userID, newName } }) => {
                        const id = Number(userID);
                        if (!id) {
                            return JSON.stringify({ error: `Incorrect userID provided: ${userID}. Must be an integer` });
                        }
                        if (!newName) {
                            return JSON.stringify({ error: "No newName provided" });
                        }
                        const result = await db.updateUser(id, newName);
                        return JSON.stringify(result);
                    },
                        { query: t.Object({ userID: t.String(), newName: t.String() }) })

                    .get("/delete", async ({ db, query: { userID } }) => {
                        const id = Number(userID);
                        if (!id) {
                            return JSON.stringify({ error: "No userID integer provided" });
                        }
                        const result = await db.deleteUser(id);
                        if (result) {
                            return JSON.stringify(`User ${userID} has been deleted`);
                        }
                        return JSON.stringify(`User ${userID} does not exist`);
                    },
                        { query: t.Object({ userID: t.String() }) })
            )





    );

export default api;