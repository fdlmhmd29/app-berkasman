import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Memuat environment variables lokal
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle", // Folder untuk menyimpan file migrasi
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
