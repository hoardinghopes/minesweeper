import { Elysia } from "elysia";

const api = new Elysia()
    .group('/fragments', (app) =>
        app
            .get("/", ({ set }) => {
                set.redirect = '/'
            })
            .get("/top-scores", async ({ db }) => {
                const result = await db.getScores();
                let output = "<table><tr><th>User</th><th>Time</th><th>Date</th></tr>";
                for (const score of result) {
                    output += `<tr><td>${score.user}</td><td>${score.timeCompleted}</td><td>${score.createdAt.toLocaleString()}</td></tr>`;
                }
                output += "</table>";
                return output;
            })
            .get("/top-scores/:level", async ({ db, params: { level } }) => {
                const result = await db.getScoresByLevel(level);
                let output = "<table><tr><th>User</th><th>Time</th><th>Date</th></tr>";
                for (const score of result) {
                    output += `<tr><td>${score.user}</td><td>${score.timeCompleted}</td><td>${score.createdAt.toLocaleString()}</td></tr>`;
                }
                output += "</table>";
                return output;
            })
            .get("/user-select-list", async ({ db }) => {
                const result = await db.getUsers();
                return `<option value='-1'>Select user</option>${result.map((user) => {
                    return `<option value="${user.id}">${user.name}</option>`;
                }).join("")}`;
            })

    );

export default api;