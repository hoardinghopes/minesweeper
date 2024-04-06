FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "drizzle-kit generate:sqlite"]
CMD ["bun", "run ./src/db/migrate.ts"]
CMD ["bun", "./src/index.tsx"]