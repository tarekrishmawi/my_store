import express from "express";

import verifyAuthToken from "../middleware/auth.js";
import {
  index,
  show,
  create,
  authenticate,
  update,
  deleteUser,
  getRecentPurchases,
} from "../handlers/users.js";

const router = express.Router();

router.get("/", verifyAuthToken, index);

router.get("/:id", verifyAuthToken, show);

router.post("/", create);

router.post("/authenticate", authenticate);

router.put("/:id", verifyAuthToken, update);

router.delete("/:id", verifyAuthToken, deleteUser);

router.get("/:id/recent-purchases", verifyAuthToken, getRecentPurchases);

export default router;
