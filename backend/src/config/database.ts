import pg from "pg";
import { env } from "./env.js";
const { Pool } = pg;

const client = new Pool({
  connectionString: env.envType === "test" ? env.testdbUrl : env.dbUrl,
});

export default client;
