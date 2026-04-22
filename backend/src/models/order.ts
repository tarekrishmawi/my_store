import Client from "../config/database.js";

export type Order = {
  id?: number;
  user_id: number;
  status?: "active" | "complete";
};

export type OrderProduct = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
};

export class OrderStore {
  // Create new order
  async create(user_id: number): Promise<Order> {
    try {
      const conn = await Client.connect();

      const sqlQuery = `
    INSERT INTO orders (user_id)
    VALUES ($1)
    RETURNING *
  `;

      const result = await conn.query(sqlQuery, [user_id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot create order: ${err}`);
    }
  }

  // update order status
  async updateStatus(orderId: number, status: string): Promise<Order> {
    try {
      const conn = await Client.connect();
      
      const sqlQuery =
        "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *";
      const result = await conn.query(sqlQuery, [status, orderId]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not update order status. Error: ${err}`);
    }
  }

  // Current active order for user
  async currentOrder(user_id: number): Promise<Order | null> {
    try {
      const conn = await Client.connect();

      const sqlQuery = `
        SELECT *
        FROM orders
        WHERE user_id = $1
        AND status = 'active'
        LIMIT 1;
      `;

      const result = await conn.query(sqlQuery, [user_id]);

      conn.release();

      return result.rows[0] || null;
    } catch (err) {
      throw new Error(`Cannot get current order: ${err}`);
    }
  }

  // Completed orders
  async completedOrders(user_id: number): Promise<Order[]> {
    try {
      const conn = await Client.connect();

      const sqlQuery = `
        SELECT *
        FROM orders
        WHERE user_id = $1
        AND status = 'complete';
      `;

      const result = await conn.query(sqlQuery, [user_id]);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get completed orders: ${err}`);
    }
  }

  // Add product to order (cart)
  async addProduct(
    quantity: number,
    order_id: number,
    product_id: number,
  ): Promise<OrderProduct> {
    try {
      const conn = await Client.connect();

      // Check order exists
      const orderCheck = await conn.query(
        "SELECT id, status FROM orders WHERE id = $1",
        [order_id],
      );

      if (orderCheck.rows.length === 0) {
        throw new Error("Order not found");
      }

      // Check order status
      if (orderCheck.rows[0].status === "complete") {
        throw new Error("Cannot add products to a completed order");
      }

      // check if product is already in order

      const duplicateCheck = await conn.query(
        `
      SELECT id FROM order_products
      WHERE order_id = $1
      AND product_id = $2
      `,
        [order_id, product_id],
      );

      if (duplicateCheck.rows.length > 0) {
        throw new Error("Product already exists in this order");
      }

      // insert
      const sqlQuery = `
        INSERT INTO order_products (
          quantity,
          order_id,
          product_id
        )
        VALUES ($1, $2, $3)
        RETURNING *;
      `;

      const result = await conn.query(sqlQuery, [
        quantity,
        order_id,
        product_id,
      ]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot add product to order: ${err}`);
    }
  }
}
