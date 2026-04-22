import { Request, Response } from "express";
import { Product, ProductStore } from "../models/product.js";

const store = new ProductStore();

export const index = async (_req: Request, res: Response) => {
  const products = await store.index();
  res.json(products);
};

export const show = async (_req: Request, res: Response) => {
  try {
    const id = Number(_req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({
        error: "Invalid product id",
      });
    }
    const product = await store.show(id);
    if (!product) {
      return res.status(404).json({
        error: "product not found",
      });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const product: Product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      image_url: req.body.image_url,
      description: req.body.description,
    };
    const newProduct = await store.create(product);
    res.json(newProduct);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({
        error: "Invalid product id",
      });
    }
    const deletedProduct = await store.delete(id);
    if (!deletedProduct) {
      return res.status(404).json({
        error: "product not found",
      });
    }
    res.json(deletedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        error: "Invalid product id",
      });
    }
    const product: Product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      image_url: req.body.image_url,
      description: req.body.description,
    };
    const updatedProduct = await store.update(id, product);
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({
      error: err instanceof Error ? err.message : err,
    });
  }
};

export const productsByCategory = async (_req: Request, res: Response) => {
  try {
    const { category } = _req.params;

    if (
      !category ||
      typeof category !== "string" ||
      category.trim().length === 0
    ) {
      return res
        .status(400)
        .json({ error: "A valid category name is required" });
    }
    const products = await store.productsByCategory(category);

    return res.json(products);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch products by category",
    });
  }
};

export const topFiveProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const products = await store.topFiveProducts();

    res.json(products);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch products",
    });
  }
};
