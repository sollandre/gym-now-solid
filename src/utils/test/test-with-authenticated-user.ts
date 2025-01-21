import { test } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

const getToken = async (userRole: Role = "MEMBER") => {
  const defaultUser = {
    name: "John Doe",
    email: "johndoe@example.com",
    password: "123456",
  };

  await request(app.server)
    .post("/users")
    .send({
      ...defaultUser,
    });

  await prisma.user.update({
    where: {
      name: defaultUser.name,
      email: defaultUser.email,
    },
    data: {
      role: userRole,
    },
  });

  const authResponse = await request(app.server).post("/sessions").send({
    email: defaultUser.email,
    password: defaultUser.password,
  });

  const { token } = authResponse.body;

  return token;
};

export const testWithAuthenticatedUser = test.extend<{
  token: string;
}>({
  token: async ({ task }, use) => {
    const token = await getToken();
    await use(token);
  },
});

export const testWithAdmin = testWithAuthenticatedUser.extend({
  token: async ({ task }, use) => {
    const token = await getToken("ADMIN");
    await use(token);
  },
});
