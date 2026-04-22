import express, { type Request, type Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Client from "./config/database.js";

import usersRoutes from "./routes/users.js";
import ordersRoutes from "./routes/orders.js";
import productsRoutes from "./routes/products.js";

const app = express();

const corsOptions = {
  origin: "http://localhost:4200",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get("/", async (req: Request, res: Response) => {
  try {
    // verify database connection
    const result = await Client.query("SELECT NOW()");
    res.json({
      message: "API is connected to Postgres!",
      server_time: result.rows[0].now,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection error");
  }
});

app.use("/users", usersRoutes);
app.use("/orders", ordersRoutes);
app.use("/products", productsRoutes);

export default app;
