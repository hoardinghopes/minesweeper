import { html } from '@elysiajs/html';
import { staticPlugin } from '@elysiajs/static';
import { swagger } from '@elysiajs/swagger';
import { Elysia } from "elysia";
import api from "./api";
import fragments from "./api/fragments";
import { ctx } from "./context";


export const app = new Elysia()
  .use(ctx)
  .use(api)
  .use(fragments)
  .use(staticPlugin({ assets: "./src/assets", prefix: "/i" }))
  .use(html())
  .use(swagger())
  .get("/", () => Bun.file("./src/index.html").text())
  .listen(3572);


console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
