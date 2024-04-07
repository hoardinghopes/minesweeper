import Elysia from "elysia";
import { config } from "../config";
import pretty from "pino-pretty";
import { HoltLogger } from "@tlscipher/holt";
import { MinesweeperDB } from "../db";

const stream = pretty({
    colorize: true,
});



export const ctx = new Elysia({
    name: "@app/ctx",
})
    .decorate('db', new MinesweeperDB())
    .decorate("config", config)
// .use(new HoltLogger().getLogger());

