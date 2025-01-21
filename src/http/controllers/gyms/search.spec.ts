import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect } from "vitest";
import {
  testWithAdmin,
  testWithAuthenticatedUser,
} from "@/utils/test/test-with-authenticated-user";

describe("Search Gyms (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  testWithAdmin("should be able to search a gym", async ({ token }) => {
    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Javascript Gym",
        phone: "11888888888",
        description: "Random description",
        latitude: -27.2092052,
        longitude: -49.6401091,
      });
    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Typescript Gym",
        phone: "11888888888",
        description: "Random description",
        latitude: -27.2092052,
        longitude: -49.6401091,
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .query({
        q: "Javascript",
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Javascript Gym",
      }),
    ]);
    expect(response.statusCode).toEqual(200);
  });
});
