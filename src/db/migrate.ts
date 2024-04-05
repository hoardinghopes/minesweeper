
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { MinesweeperDB } from "./index";


await migrate(new MinesweeperDB().getDB(), { migrationsFolder: "drizzle" });
