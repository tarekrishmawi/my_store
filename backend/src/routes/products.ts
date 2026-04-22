import express from "express";
import verifyAuthToken from "../middleware/auth.js";

import {
  index,
  show,
  create,
  productsByCategory,
  topFiveProducts,
  updateProduct,
  deleteProduct,
} from "../handlers/products.js";

const router = express.Router();

router.get("/", index);

router.get("/popular/topfive", topFiveProducts);

router.get("/category/:category", productsByCategory);

router.get("/:id", show);

router.put("/:id", verifyAuthToken, updateProduct);

router.delete("/:id", verifyAuthToken, deleteProduct);

router.post("/", verifyAuthToken, create);

export default router;
