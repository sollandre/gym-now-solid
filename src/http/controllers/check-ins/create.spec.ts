import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect } from "vitest";
import { testWithAuthenticatedUser } from "@/utils/test/test-with-authenticated-user";
import { prisma } from "@/lib/prisma";

describe("Create Check-in (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  testWithAuthenticatedUser(
    "should be able to create a check-in",
    async ({ token }) => {
      const gym = await prisma.gym.create({
        data: {
          title: "Javascript Gym",
          latitude: -27.2092052,
          longitude: -49.6401091,
        },
      });

      const response = await request(app.server)
        .post(`/gyms/${gym.id}/check-ins`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          latitude: -27.2092051,
          longitude: -49.640109,
        });

      expect(response.statusCode).toEqual(201);
    },
  );
});
