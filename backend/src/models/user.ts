import Client from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export type User = {
  id?: number;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  password_hash?: string;
};

// userStore class

export class UserStore {
  // index
  async index(): Promise<User[]> {
    const conn = await Client.connect();
    try {
      const sqlQuery = "SELECT * FROM users";
      const result = await conn.query(sqlQuery);

      return result.rows;
    } catch (error) {
      throw new Error(`Could not get users. Error: ${error}`);
    } finally {
      conn.release();
    }
  }

  // show a user
  async show(id: number): Promise<User> {
    const conn = await Client.connect();
    try {
      const sqlQuery = `
        SELECT 
            id,
            first_name AS "firstName",
            last_name AS "lastName",
            username AS "userName",
            password_hash
          FROM users
          WHERE id = $1;
        `;

      const result = await conn.query(sqlQuery, [id]);

      const user = result.rows[0];

      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }

      const recent = await this.getRecentPurchases(id);

      return {
        ...user,
        recentPurchases: recent,
      };
    } catch (err) {
      throw new Error(`Cannot get user with ID: ${id}: ${err}`);
    } finally {
      conn.release();
    }
  }

  // create a user
  async create(user: User): Promise<User> {
    const conn = await Client.connect();
    try {
      // Check username first
      const checkSqlQuery = "SELECT id FROM users WHERE username = $1";

      const checkResult = await conn.query(checkSqlQuery, [user.userName]);

      if (checkResult.rows.length > 0) {
        const error: any = new Error("Username already exists");
        error.code = "USERNAME_EXISTS";
        throw error;
      }
      const hash = await bcrypt.hash(
        user.password + env.pepper,
        parseInt(env.saltRounds),
      );

      const sqlQuery = `
        INSERT INTO users (
          first_name,
          last_name,
          username,
          password_hash
        )
        VALUES ($1, $2, $3, $4)
        RETURNING id, first_name, last_name, username
      `;

      const result = await conn.query(sqlQuery, [
        user.firstName,
        user.lastName,
        user.userName,
        hash,
      ]);

      const newUser = result.rows[0];
      const token = jwt.sign({ user: newUser }, env.tokenSecret);

      return { ...newUser, token };
    } catch (err) {
      throw new Error(`Cannot create user: ${err}`);
    } finally {
      conn.release();
    }
  }

  //authenticate user
  async authenticate(username: string, password: string): Promise<User | null> {
    const conn = await Client.connect();

    try {
      const sql = "SELECT * FROM users WHERE username = $1";

      const result = await conn.query(sql, [username]);

      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];

      const isValid = await bcrypt.compare(
        password + env.pepper,
        user.password_hash,
      );

      if (!isValid) {
        return null;
      }
      return {
        ...user,
        userName: user.username,
      };
    } catch (err) {
      throw new Error(`Authentication failed: ${(err as Error).message}`);
    } finally {
      conn.release();
    }
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    const conn = await Client.connect();

    try {
      // Check if user exists
      const existingUser = await this.show(id);

      if (!existingUser) {
        throw new Error(`User with id ${id} does not exist`);
      }

      // Prepare password
      // use of let here because we may need to update the hashed password if a new password is provided
      let hashedPassword = existingUser.password_hash;

      if (user.password) {
        hashedPassword = await bcrypt.hash(
          user.password + env.pepper,
          parseInt(env.saltRounds),
        );
      }

      const sql = `
      UPDATE users
      SET
        first_name = $1,
        last_name = $2,
        username = $3,
        password_hash = $4
      WHERE id = $5
     RETURNING id, first_name AS "firstName", last_name AS "lastName", username AS "userName"
    `;

      const result = await conn.query(sql, [
        user.firstName ?? existingUser.firstName,
        user.lastName ?? existingUser.lastName,
        user.userName ?? existingUser.userName,
        hashedPassword,
        id,
      ]);

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not update user ${id}: ${(err as Error).message}`);
    } finally {
      conn.release();
    }
  }

  // delete a user
  async delete(id: number): Promise<User | null> {
    const conn = await Client.connect();

    try {
      const sqlQuery = `
      DELETE FROM users 
      WHERE id=$1
      RETURNING id, username, first_name AS "firstName", last_name AS "lastName"
    `;

      const result = await conn.query(sqlQuery, [id]);

      return result.rows[0] || null;
    } catch (err) {
      throw new Error(`Could not delete user ${id}: ${err}`);
    } finally {
      conn.release();
    }
  }

  async getRecentPurchases(userId: number): Promise<any[]> {
    const conn = await Client.connect();

    try {
      // check if user exists
      const userCheckQuery = "SELECT id FROM users WHERE id = $1";
      const userCheckResult = await conn.query(userCheckQuery, [userId]);

      if (userCheckResult.rows.length === 0) {
        throw new Error(`User with ID ${userId} does not exist`);
      }

      const sqlQuery = `
        SELECT 
          o.id AS order_id, 
          o.status, 
          p.id AS product_id, 
          p.name, 
          op.quantity 
        FROM orders o 
        JOIN order_products op ON o.id = op.order_id 
        JOIN products p        ON p.id = op.product_id 
        WHERE 
          o.user_id = $1 
          AND o.status = 'complete' 
        ORDER BY o.id DESC 
        LIMIT 5
        `;

      const result = await conn.query(sqlQuery, [userId]);

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get recent purchases: ${err}`);
    } finally {
      conn.release();
    }
  }
}
