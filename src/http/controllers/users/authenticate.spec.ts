import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Authenticate (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to authenticate", async () => {
    await request(app.server).post("/users").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "helloworld",
    });

    const response = await request(app.server).post("/sessions").send({
      email: "johndoe@example.com",
      password: "helloworld",
    });

    expect(response.body).toEqual({
      token: expect.any(String),
    });
    expect(response.statusCode).toEqual(200);
  });
});
