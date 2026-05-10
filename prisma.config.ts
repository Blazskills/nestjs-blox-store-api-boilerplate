import * as dotenv from "dotenv";
import * as path from "path";
import { defineConfig } from "prisma/config";

// Load the environment file from our custom folder
const envPath = path.resolve(
  process.cwd(),
  `.envs/.${process.env.NODE_ENV || 'local'}/.db`
);
dotenv.config({ path: envPath });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
