import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, BenchFunction } from "vitest";
import {
  testWithAdmin,
  testWithAuthenticatedUser,
} from "@/utils/test/test-with-authenticated-user";
import { prisma } from "@/lib/prisma";

describe("Validate Check-in (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  testWithAdmin("should be able to validate a check-in", async ({ token }) => {
    const gym = await prisma.gym.create({
      data: {
        title: "Javascript Gym",
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    });

    const userInfo = await prisma.user.findFirstOrThrow();

    let checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: userInfo.id,
      },
    });

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(204);

    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
  });
});
