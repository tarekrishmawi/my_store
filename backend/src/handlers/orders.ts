import { Request, Response } from "express";
import { OrderStore } from "../models/order.js";

const store = new OrderStore();

export const create = async (req: Request, res: Response) => {
  try {
    const user_id = Number(req.body.user_id);

    if (!user_id) {
      return res.status(400).json({
        error: "user_id is required",
      });
    }

    const order = await store.create(user_id);

    res.json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    // const orderID = req.params.id;
    const id = Number(req.params.id);
    const { status } = req.body;

    if (typeof id === "string" || isNaN(id)) {
      return res.status(400).json({ error: "A valid Order ID is required" });
    }

    if (!status || typeof status !== "string") {
      return res
        .status(400)
        .json({ error: "Status is required and must be a string" });
    }

    const updatedOrder = await store.updateStatus(id, status);

    if (!updatedOrder) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    return res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: `Failed to update order status: ${(error as Error).message}`,
    });
  }
};

export const currentOrder = async (req: Request, res: Response) => {
  try {
    const user_id = Number(req.params.user_id);

    if (!user_id) {
      return res.status(400).json({
        error: "user_id is required",
      });
    }

    const order = await store.currentOrder(user_id);

    res.json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const completedOrders = async (req: Request, res: Response) => {
  try {
    const user_id = Number(req.params.user_id);

    if (!user_id) {
      return res.status(400).json({
        error: "user_id is required",
      });
    }

    const orders = await store.completedOrders(user_id);

    res.json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const order_id = Number(req.params.id);
    const quantity = Number(req.body.quantity);
    const product_id = Number(req.body.product_id);

    // Validate order id
    if (!order_id || isNaN(order_id)) {
      return res.status(400).json({
        error: "Valid order ID is required",
      });
    }

    // Validate product id
    if (!product_id || isNaN(product_id)) {
      return res.status(400).json({
        error: "Valid product ID is required",
      });
    }

    // Validate quantity
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({
        error: "Quantity must be a positive number",
      });
    }

    const result = await store.addProduct(quantity, order_id, product_id);

    res.json(result);
  } catch (err) {
    res.status(400).json({
      error: (err as Error).message,
    });
  }
};
