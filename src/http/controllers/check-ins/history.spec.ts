import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect } from "vitest";
import { testWithAuthenticatedUser } from "@/utils/test/test-with-authenticated-user";
import { prisma } from "@/lib/prisma";

describe("Check-in History (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  testWithAuthenticatedUser(
    "should be able to list the history of check-ins",
    async ({ token }) => {
      const gym = await prisma.gym.create({
        data: {
          title: "Javascript Gym",
          latitude: -27.2092052,
          longitude: -49.6401091,
        },
      });

      const userInfo = await prisma.user.findFirstOrThrow();

      await prisma.checkIn.createMany({
        data: [
          {
            gym_id: gym.id,
            user_id: userInfo.id,
          },
          {
            gym_id: gym.id,
            user_id: userInfo.id,
          },
        ],
      });

      const response = await request(app.server)
        .get(`/check-ins/history`)
        .set("Authorization", `Bearer ${token}`)
        .send();

      expect(response.statusCode).toEqual(200);
      expect(response.body.checkIns).toEqual([
        expect.objectContaining({
          gym_id: gym.id,
          user_id: userInfo.id,
        }),
        expect.objectContaining({
          gym_id: gym.id,
          user_id: userInfo.id,
        }),
      ]);
    },
  );
});
