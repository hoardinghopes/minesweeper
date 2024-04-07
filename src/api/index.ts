import { Elysia, t } from "elysia";
import { MinesweeperDB } from "../db";

const api = new Elysia()
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

                    .post("/new", async ({ db, body: { timeCompleted, playerID, playerName } }) => {
                        if (!playerID) {
                            return JSON.stringify({ error: "No userID integer provided" });
                        }
                        if (!timeCompleted) {
                            return JSON.stringify({ error: "No timeCompleted integer provided" });
                        }

                        let user = await db.getUser(playerID);
                        if (!user) {
                            user = await db.addUser(playerName);
                            playerID = user.id;
                        }

                        const result = await db.addScore(timeCompleted, playerID);
                        return JSON.stringify(result);
                    },
                        { body: t.Object({ timeCompleted: t.Number(), playerID: t.Number(), playerName: t.String() }) })

                    .get("/delete", async ({ db, query: { scoreID } }) => {
                        const id = Number(scoreID);
                        if (!id) {
                            return JSON.stringify({ error: "No scoreID integer provided" });
                        }
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