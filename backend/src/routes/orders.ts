import express from "express";
import verifyAuthToken from "../middleware/auth.js";

import {
  create,
  updateOrderStatus,
  currentOrder,
  completedOrders,
  addProduct,
} from "../handlers/orders.js";

const router = express.Router();

router.post("/", create);

router.put("/:id", verifyAuthToken, updateOrderStatus);

router.get("/current/:user_id", verifyAuthToken, currentOrder);

router.get("/completed/:user_id", verifyAuthToken, completedOrders);

router.post("/:id/products", verifyAuthToken, addProduct);

export default router;
