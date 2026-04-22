import Client from "../config/database.js";

export type Product = {
  id?: number;
  name: string;
  price: number;
  category?: string;
  image_url?: string;
  description?: string;
};

export class ProductStore {
  // Products index
  async index(): Promise<Product[]> {
    const conn = await Client.connect();
    try {
      const sqlQuery = `
      SELECT *
      FROM products
    `;
      const result = await conn.query(sqlQuery);
      return result.rows;
    } catch (error) {
      throw new Error(`Could not get products. Error: ${error}`);
    } finally {
      conn.release();
    }
  }

  // show a product
  async show(id: number): Promise<Product> {
    const conn = await Client.connect();
    try {
      const sqlQuery = `
        SELECT *
        FROM  products 
        WHERE id = $1
      `;

      const result = await conn.query(sqlQuery, [id]);

      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot get product with ID: ${id}: ${err}`);
    } finally {
      conn.release();
    }
  }

  // create a product
  async create(product: Product): Promise<Product> {
    const conn = await Client.connect();
    try {
      const sqlQuery = `
      INSERT INTO products (
        name,
        price,
        category,
        image_url,
        description
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

      const result = await conn.query(sqlQuery, [
        product.name,
        product.price,
        product.category,
        product.image_url,
        product.description,
      ]);

      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not create Product. Error: ${error}`);
    } finally {
      conn.release();
    }
  }

  // delete a product
  async delete(id: number): Promise<Product | null> {
    const conn = await Client.connect();

    try {
      const sqlQuery = `
      DELETE FROM products
      WHERE id=$1
      RETURNING *
    `;

      const result = await conn.query(sqlQuery, [id]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not delete product ${id}: ${err}`);
    } finally {
      conn.release();
    }
  }

  // update a product
  async update(id: number, product: Product): Promise<Product> {
    const conn = await Client.connect();

    try {
      if (!product.name || !product.price) {
        throw new Error("Missing required product fields");
      }

      const sqlQuery = `
      UPDATE products
      SET name = $1,
          price = $2,
          category = $3,
          image_url = $4,
          description = $5
      WHERE id = $6
      RETURNING *
    `;

      const result = await conn.query(sqlQuery, [
        product.name,
        product.price,
        product.category,
        product.image_url,
        product.description,
        id,
      ]);

      if (result.rows.length === 0) {
        throw new Error(`Product with id ${id} does not exist`);
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not update product ${id}: ${(error as Error).message}`,
      );
    } finally {
      conn.release();
    }
  }

  // products by category
  async productsByCategory(category: string): Promise<Product[]> {
    const conn = await Client.connect();
    try {
      const sqlQuery = `
      SELECT *
      FROM products
      WHERE category ILIKE $1
    `;

      const result = await conn.query(sqlQuery, [`%${category}%`]);

      return result.rows;
    } catch (error) {
      throw new Error(
        `Could not get products with category ${category}. Error: ${error}`,
      );
    } finally {
      conn.release();
    }
  }

  // Top 5 most popular products
  async topFiveProducts(): Promise<Product[]> {
    const conn = await Client.connect();
    try {
      const sqlQuery = `
        SELECT p.id, p.name, p.price, p.category,
               SUM(op.quantity) AS total_quantity
        FROM products p
        JOIN order_products op
          ON p.id = op.product_id
        GROUP BY p.id
        ORDER BY total_quantity DESC
        LIMIT 5;
      `;

      const result = await conn.query(sqlQuery);

      if (!result.rows) {
        throw new Error("No products found");
      }

      return result.rows;
    } catch (error) {
      throw new Error(`Cannot get top products: ${(error as Error).message}`);
    } finally {
      conn.release();
    }
  }
}
