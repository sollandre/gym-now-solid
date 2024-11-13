import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  //Add new env variables as necessary
  NODE_ENV: z.enum(["dev", "test", "prd"]).default("dev"),
  PORT: z.coerce.number(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  //Error handling for missing env variables

  console.error("Environment variables missing", _env.error.format());

  throw new Error("Environment variables missing");
}

export const env = _env.data;
