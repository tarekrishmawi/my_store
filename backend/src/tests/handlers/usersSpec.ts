import request from "supertest";
import app from "../../app.js";
import { UserStore } from "../../models/user.js";

const store = new UserStore();

describe("Users Endpoints", () => {
  let token: string;
  let userId: number;

  // The user we will create via the API
  const testUser = {
    firstName: "API",
    lastName: "User",
    userName: "api_user_" + Date.now(),
    password: "password123",
  };

  beforeAll(async () => {
    // 1. Create a seed user directly via Model to get a token
    // This bypasses the middleware restriction for the very first user
    const seed = {
      firstName: "Seed",
      lastName: "User",
      userName: "seed_" + Date.now(),
      password: "password123",
    };

    const createdSeed: any = await store.create(seed);
    token = createdSeed.token; //this token wil be used for all protected routes tests
  });

  it("should create a new user when authorized", async () => {
    const res = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send(testUser);

    expect(res.status).toBe(200);

    expect(res.body.username).toEqual(testUser.userName);

    userId = res.body.id;
  });

  // Test: POST /users/authenticate (Public)
  it("should authenticate user and return a token", async () => {
    const res = await request(app).post("/users/authenticate").send({
      username: testUser.userName,
      password: testUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  // Test: GET /users (Protected)
  it("should get the list of users", async () => {
    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should get a single user by ID", async () => {
    const res = await request(app)
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toEqual(userId);
  });

  it("should deny access to GET /users if token is missing", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(401);
  });

  it("should update user information (PUT /users/:id)", async () => {
    const res = await request(app)
      .put(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "UpdatedName",
        password: "newPassword123",
      });

    expect(res.status).toBe(200);
    expect(res.body.firstName).toEqual("UpdatedName");
  });

  it("should delete the user (DELETE /users/:id)", async () => {
    const res = await request(app)
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
