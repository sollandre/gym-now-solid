import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testWithAuthenticatedUser } from "@/utils/test/test-with-authenticated-user";

describe("Profile (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  testWithAuthenticatedUser(
    "should be able to get user profile",
    async ({ token }) => {
      const profileResponse = await request(app.server)
        .get("/me")
        .set("Authorization", `Bearer ${token}`)
        .send();

      expect(profileResponse.body.user).toEqual(
        expect.objectContaining({
          email: "johndoe@example.com",
        }),
      );
      expect(profileResponse.statusCode).toEqual(200);
    },
  );
});
