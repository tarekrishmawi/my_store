import { UserStore } from "../../models/user.js";

const store = new UserStore();

describe("User Model", () => {
  const user = {
    firstName: "Test",
    lastName: "User",
    userName: "testuser" + "user_" + Date.now(),
    password: "password123",
  };

  let createdUserId: number;

  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("should have a create method", () => {
    expect(store.create).toBeDefined();
  });

  it("should create a user", async () => {
    const result: any = await store.create(user);

    createdUserId = result.id;

    expect(result.id).toBeDefined();
  });

  it("should return list of users", async () => {
    const result = await store.index();

    expect(result.length).toBeGreaterThan(0);
  });

  it("should show a user", async () => {
    const result = await store.show(createdUserId);

    expect(result.id).toEqual(createdUserId);
  });

  it("should authenticate user", async () => {
    const result = await store.authenticate(user.userName, user.password);

    expect(result).not.toBeNull();
    expect(result?.userName).toEqual(user.userName);
  });

  it("should return users recent purchases", async () => {
    const purchases = await store.getRecentPurchases(createdUserId!);

    expect(Array.isArray(purchases)).toBe(true);
  });

  it("should update a user", async () => {
    const updatedData = {
      ...user,
      firstName: "Updated",
    };
    const result = await store.update(createdUserId, updatedData);

    expect(result.firstName).toEqual("Updated");
  });

  it("should delete a user", async () => {
    const result = await store.delete(createdUserId);
    expect(result?.id).toEqual(createdUserId);
  });
});
