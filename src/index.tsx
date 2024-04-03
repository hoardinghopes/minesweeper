import { Elysia } from "elysia";
import api from "./api";
import { MinesweeperDB } from "./db";
import { html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static'

const app = new Elysia()
  .decorate('db', new MinesweeperDB())
  .use(staticPlugin({ assets: "./src/assets", prefix: "/i" }))
  .use(api)
  .use(html())
  .get("/", () => Bun.file("./src/index.html").text());




app.listen(3572);


console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
