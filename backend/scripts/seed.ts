import bcrypt from "bcrypt";

import Client from "../src/config/database.js";
import { env } from "../src/config/env.js";

//  seed a default user for testing and development purposes
const seedUser = async () => {
  try {
    console.log("Seeding default user...");

    const hash = await bcrypt.hash(
      "tarek2026" + env.pepper,
      parseInt(env.saltRounds),
    );

    await Client.query(
      `
      INSERT INTO users (first_name, last_name , username, password_hash)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (username) DO NOTHING
      `,
      ["Tarek", "Rishmawi", "tarekrishmawi", hash],
    );

    console.log("Default user Tarek Rishmawi created");
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await Client.end();
  }
};

seedUser();
