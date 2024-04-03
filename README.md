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
bun drizzle-kit generate:sqlite
bun run ./src/db/migrate.ts
```

## Development

To start the development server run:

```bash
bun dev
```

Open <http://localhost:3572/> with your browser to see the result.
