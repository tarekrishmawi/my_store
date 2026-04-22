import fs from "fs/promises";

import Client from "../src/config/database.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedProducts = async () => {
  try {
    console.log("Seeding products...");

    const dataPath = path.join(__dirname, "data.json");

    const data = JSON.parse(await fs.readFile(dataPath, "utf-8"));

    for (const product of data) {
      await Client.query(
        `
        INSERT INTO products (name, price, category, image_url, description)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING
        `,
        [
          product.name,
          product.price,
          product.category,
          product.imageUrl,
          product.description,
        ],
      );
    }

    console.log("Products seeded successfully");
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await Client.end();
  }
};

seedProducts();
