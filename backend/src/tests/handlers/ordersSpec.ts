import request from "supertest";
import app from "../../app.js";
import { UserStore } from "../../models/user.js";
import { ProductStore } from "../../models/product.js";

const userStore = new UserStore();
const productStore = new ProductStore();

describe("Orders Endpoints", () => {
  let token: string;
  let userId: number;
  let productId: number;
  let orderId: number;

  beforeAll(async () => {
    // 1. Create user to get token
    const user: any = await userStore.create({
      firstName: "test",
      lastName: "user",
      userName: "test_user_order_" + Date.now(),
      password: "password123",
    });
    userId = user.id;
    token = user.token;

    // 2. Create product
    const product = await productStore.create({
      name: "Handler Product",
      price: 100,
      category: "API",
    });
    productId = product.id as number;
  });

  it("should create a new order (POST /orders)", async () => {
    const res = await request(app)
      .post("/orders")
      .send({ user_id: userId });

    expect(res.status).toBe(200);
    orderId = res.body.id;
  });

  it("should add a product to order (POST /orders/:id/products)", async () => {
    const res = await request(app)
      .post(`/orders/${orderId}/products`)
      .send({
        quantity: 3,
        product_id: productId,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.order_id).toEqual(orderId);
  });

  it("should get the current order (GET /orders/current/:user_id)", async () => {
    const res = await request(app)
      .get(`/orders/current/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toEqual("active");
  });

  it("should update order status (PUT /orders/:id)", async () => {
    const res = await request(app)
      .put(`/orders/${orderId}`)
      .send({ status: "complete" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toEqual("complete");
  });

  it("should get completed orders (GET /orders/completed/:user_id)", async () => {
    const res = await request(app)
      .get(`/orders/completed/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].status).toEqual("complete");
  });
});
