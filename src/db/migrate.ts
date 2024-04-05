
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { MinesweeperDB } from "./index";

const db = new MinesweeperDB().getDB();
await migrate(db, { migrationsFolder: "drizzle" });


console.log("db migrated, so now you must check that `PRAGMA foreign_keys = ON` is in place");