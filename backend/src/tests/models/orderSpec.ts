import { OrderStore } from "../../models/order.js";
import { UserStore } from "../../models/user.js";
import { ProductStore } from "../../models/product.js";

const store = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

describe("Order Model", () => {
  let userId: number;
  let productId: number;
  let orderId: number;

  beforeAll(async () => {
    // 1. Create a user
    const user = await userStore.create({
      firstName: "Order",
      lastName: "Tester",
      userName: "order_test_" + Date.now(),
      password: "password123"
    });
    userId = user.id as number;

    // 2. Create a product to add to the order
    const product = await productStore.create({
      name: "Product Test Item",
      price: 50,
      category: "Test"
    });
    productId = product.id as number;
  });

  it("should create an order", async () => {
    const result = await store.create(userId);
    orderId = result.id as number;
    expect(result.user_id).toEqual(userId);
    expect(result.status).toEqual("active");
  });

  it("should add a product to an order", async () => {
    const result = await store.addProduct(5, orderId, productId);
    expect(result.order_id).toEqual(orderId);
    expect(result.product_id).toEqual(productId);
    expect(result.quantity).toEqual(5);
  });

  it("should get the current active order for a user", async () => {
    const result = await store.currentOrder(userId);
    expect(result?.id).toEqual(orderId);
    expect(result?.status).toEqual("active");
  });

  it("should update order status", async () => {
    const result = await store.updateStatus(orderId, "complete");
    expect(result.status).toEqual("complete");
  });

  it("should get completed orders for a user", async () => {
    const result = await store.completedOrders(userId);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].status).toEqual("complete");
  });
});