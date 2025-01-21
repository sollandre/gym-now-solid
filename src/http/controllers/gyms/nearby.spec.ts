import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect } from "vitest";
import {
  testWithAdmin,
  testWithAuthenticatedUser,
} from "@/utils/test/test-with-authenticated-user";

describe("Fetch Nearby Gyms (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  testWithAdmin("should be able to find a nearby gym", async ({ token }) => {
    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Near Gym",
        phone: "11888888888",
        description: "Random description",
        latitude: -27.2092052,
        longitude: -49.6401091,
      });
    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Far Gym",
        phone: "11888888888",
        description: "Random description",
        latitude: 0,
        longitude: 0,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: -27.2092051,
        longitude: -49.640109,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty("gyms");
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Near Gym",
      }),
    ]);
    expect(response.body.gyms).toHaveLength(1);
  });
});
