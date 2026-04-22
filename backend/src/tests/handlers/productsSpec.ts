import request from "supertest";
import app from "../../app.js";
import { UserStore } from "../../models/user.js";

const userStore = new UserStore();

describe("Products Endpoints", () => {
  let token: string;
  let productId: number;

  const product = {
    name: "Smartphone",
    price: 500,
    category: "Gadgets",
  };

  beforeAll(async () => {
    // We need a token because POST /products is protected
    const seedUser = {
      firstName: "Product",
      lastName: "Admin",
      userName: "prod_admin_" + Date.now(),
      password: "password123",
    };
    const createdUser: any = await userStore.create(seedUser);
    token = createdUser.token;
  });

  it("should create a product (POST /products)", async () => {
    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send(product);

    expect(res.status).toBe(200);
    expect(res.body.name).toEqual(product.name);
    productId = res.body.id;
  });

  it("should fail to create a product without a token", async () => {
    const res = await request(app).post("/products").send(product);

    expect(res.status).toBe(401);
  });

  it("should list all products (GET /products)", async () => {
    const res = await request(app).get("/products");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get product by id (GET /products/:id)", async () => {
    const res = await request(app).get(`/products/${productId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toEqual(productId);
  });

  it("should filter by category (GET /products/category/:category)", async () => {
    const res = await request(app).get("/products/category/Gadgets");
    expect(res.status).toBe(200);
    expect(res.body[0].category).toEqual("Gadgets");
  });

  it("should get top five popular products (GET /products/popular/topfive)", async () => {
    const res = await request(app).get("/products/popular/topfive");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should update a product (PUT /products/:id)", async () => {
    const updatedProduct = {
      name: "Updated Smartphone",
      price: 550,
      category: "Gadgets",
    };
    const res = await request(app)
      .put(`/products/${productId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedProduct);
    expect(res.status).toBe(200);
    expect(res.body.name).toEqual(updatedProduct.name);
  });

  it("should delete a product (DELETE /products/:id)", async () => {
    const res = await request(app)
      .delete(`/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toEqual(productId);
  });
});
