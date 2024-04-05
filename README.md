# Minesweeper

Many years ago, before we had children perhaps, my wife and I would play the minesweeper that came with my Windows PC. It was an innocent time.

I haven't had a Windows box since 2009. Strictly Mac only – firstly for work requirements, and then for pleasure.

Also, two children.

But she recently said that she would like to play again, and have the app keep a tally of the scores.

*This project was born!*

## Technologies

All good projects make space for playing with one new technology. But home projects should grab every brand new technology there is and mash them together ...

- [bun.sh](https://bun.sh/) - Nodejs alternative
- [elysia](https://elysiajs.com/) - an ergonomic web framework for building backend servers with Bun.
- [sqlite](https://www.sqlite.org/) - a small, fast, self-contained, high-reliability, full-featured, SQL database engine
- [drizzleORM](https://orm.drizzle.team/) - Drizzle ORM is a headless TypeScript ORM
- ([alpinejs](https://alpinejs.dev/)) - a lightweight, JavaScript framework
- ([htmx](https://htmx.org/)) - a library that allows you to access modern browser features directly from HTML, rather than using javascript.

## Project set up

Using `fnm`, I have set the project's node version to v20.10.0 (necessary for `biome` on `arm64` architecture).
I am using `bun` 1.1.0.

All other versions are in `package.json`.

So, to set up the project and pull in all dependencies:

```zsh
bun install
```

## Database set up

```zsh
# generate the SQL migration
bun drizzle-kit generate:sqlite
# run all new migrations
bun run ./src/db/migrate.ts
```

For `foreign key` constraints to work (e.g. cascading deletes), this functionality has to be switched on *within* the database:
```zsh
#sqlite3 ./data/minsweeper.db

PRAGMA foreign_keys  = ON;
```

## Development

To start the development server run:

```bash
bun dev
```

Open <http://localhost:3572/> with your browser to see the result.

## TODO list

- Style *beyond a single green button*
- Improve Instructions panel, so they are obvious as they change
- ~~Retrieving users from DB ~~
- ~~Add field to create new user~~
- ~~Record date/time of game result, and display in the high scores.~~
- ~~`newGame()` called onload, which grabs `gameParameters` *before* form has been updated with chosen settings/username.~~
- ~~add `deleteUser()` that cascades through `scores` deleting them too~~
- fix the incorrect numbers surrounding mines, e.g. a beginner's game shows 11 mines! **Still need to check this is true**
- ~~update types etc so that Swagger interface is more useful~~
- ~~`db.addScore()` does too much - it checks for a user, and creates one if it doesn't exist, and then adds the score. All this should be the responsibility of the API call, and `addScore()` should only add the score.~~
- cover API with tests
