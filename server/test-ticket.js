import "dotenv/config";
import { PrismaClient } from "./src/generated/client.ts";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const tickets = await prisma.ticket.findMany({
  include: {
    notes: true,
  },
});

console.log(JSON.stringify(tickets, null, 2));

await prisma.$disconnect();