import { Client } from "pg";
import { env } from "../src/config/env";

const { dbUrl, testdbUrl } = env || {};

// create databases if they don't exist
const createDatabase = async (dbUrl: string | undefined) => {
  if (!dbUrl) {
    throw new Error("Database URL is missing");
  }

  const parsed = new URL(dbUrl);

  const dbName = parsed.pathname.replace("/", "");

  // connect to default postgres database
  const client = new Client({
    host: parsed.hostname,
    port: Number(parsed.port),
    user: parsed.username,
    password: parsed.password, 
    database: "postgres",
  });

  try {
    await client.connect();

    console.log(`Checking database: ${dbName}`);

    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname='${dbName}'`,
    );

    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database created: ${dbName}`);
    } else {
      console.log(`Database already exists: ${dbName}`);
    }
  } catch (err) {
    console.error("Error creating database:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
};

const main = async () => {
  await createDatabase(dbUrl);
  await createDatabase(testdbUrl);

  console.log("Database setup completed");
};

main();
