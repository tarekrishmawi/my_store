import express, { Request, Response } from "express";
import { User, UserStore } from "../models/user.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const store = new UserStore();

export const index = async (_req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const show = async (_req: Request, res: Response) => {
  try {
    const id = Number(_req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({
        error: "Invalid user id",
      });
    }
    const user = await store.show(id);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, userName, password } = req.body || {};

    // Required fields validation
    if (!firstName || !lastName || !userName || !password) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    // Type validation
    if (
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof userName !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        error: "Invalid input types",
      });
    }

    // Password strength
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    const user: User = {
      firstName,
      lastName,
      userName: userName,
      password,
    };

    const newUser = await store.create(user);

    res.json(newUser);
  } catch (err: any) {
    if (err.code === "USERNAME_EXISTS") {
      return res.status(409).json({
        error: {
          message: "Username already exists",
          field: "userName",
          code: "USERNAME_EXISTS",
        },
      });
    }

    res.status(400).json({
      error: {
        message: err.message || "Something went wrong",
      },
    });
  }
};

export const authenticate = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { username, password } = req.body || {};

    // validation
    if (!username || !password) {
      res.status(400).json({
        error: "Username and password are required",
      });
      return;
    }

    if (typeof username !== "string" || typeof password !== "string") {
      res.status(400).json({
        error: "Invalid input types",
      });
      return;
    }

    const user = await store.authenticate(username, password);

    if (!user) {
      res.status(401).json({
        error: "Invalid credentials",
      });
      return;
    }

    const token = jwt.sign({ user }, env.tokenSecret, { expiresIn: "1d" });

    res.json({ token });
  } catch (err) {
    res.status(500).json({
      error: (err as Error).message,
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { firstName, lastName, userName, password } = req.body || {};

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // update any provided fields
    const userData: Partial<User> = {};
    if (firstName) userData.firstName = firstName;
    if (lastName) userData.lastName = lastName;
    if (userName) userData.userName = userName;

    // Handle Password Validation if provided
    if (password) {
      if (typeof password !== "string" || password.length < 6) {
        return res.status(400).json({
          error: "New password must be a string and at least 6 characters",
        });
      }
      userData.password = password;
    }

    const updatedUser = await store.update(
      id,
      userData as Partial<User> as User,
    );

    res.json(updatedUser);
  } catch (err) {
    const msg = (err as Error).message;
    res.status(msg.includes("not exist") ? 404 : 400).json({ error: msg });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const deletedUser = await store.delete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(deletedUser);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const getRecentPurchases = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const purchases = await store.getRecentPurchases(userId);

    res.json(purchases);
  } catch (err) {
    const msg = (err as Error).message;
    res.status(msg.includes("does not exist") ? 404 : 400).json({ error: msg });
  }
};
