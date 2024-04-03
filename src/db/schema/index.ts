import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";



export const users = sqliteTable('users', {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
});

export type User = typeof users.$inferSelect;

export const scores = sqliteTable('scores', {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    timeCompleted: integer("timeCompleted", { mode: "number" }).notNull(),
    userId: integer("userId")
        .notNull()
        .references(() => users.id)
});

