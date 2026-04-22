import { ProductStore, Product } from "../../models/product.js";

const store = new ProductStore();

describe("Product Model", () => {
  const testProduct: Product = {
    name: "Test Laptop",
    price: 999,
    category: "Electronics",
  };
  let createdProductId: number;

  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("should create a product", async () => {
    const result = await store.create(testProduct);
    createdProductId = result.id as number;
    expect(result.name).toEqual(testProduct.name);
    expect(Number(result.price)).toEqual(testProduct.price);
  });

  it("should return a list of products", async () => {
    const result = await store.index();
    expect(result.length).toBeGreaterThan(0);
  });

  it("should show a single product", async () => {
    const result = await store.show(createdProductId);
    expect(result.id).toEqual(createdProductId);
    expect(result.name).toEqual(testProduct.name);
  });

  it("should filter products by category", async () => {
    const result = await store.productsByCategory("Electronics");
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].category?.toLowerCase()).toContain("electronics");
  });

  it("should return top five popular products", async () => {
    const result = await store.topFiveProducts();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should update a product", async () => {
    const updatedProduct: Product = {
      name: "Updated test Laptop",
      price: 1099,
      category: "Electronics",
    };
    const result = await store.update(createdProductId, updatedProduct);
    expect(result.name).toEqual(updatedProduct.name);
    expect(Number(result.price)).toEqual(updatedProduct.price);
  });

  it("should delete a product", async () => {
    const result = await store.delete(createdProductId);
    expect(result?.id).toEqual(createdProductId);
  });
});
