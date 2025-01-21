import { expect, describe, it, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import InMemoryUsersRepository from "@/repositories/in-memory/in-memory-users-repository";
import { UsersAlreadyExistsError } from "./errors/user-already-exists-error";

let sut: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    const usersRepo = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepo);
  });

  it("should be able to register", async () => {
    const password = "genericpassword";

    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@email.com",
      password: password,
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash the user password upon registration", async () => {
    const password = "genericpassword";

    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@email.com",
      password: password,
    });

    const isPasswordCorrectlyHashed = await compare(
      password,
      user.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const email = "johndoe@email.com";

    await sut.execute({
      name: "John Doe",
      email,
      password: "randompassword",
    });

    await expect(() => {
      return sut.execute({
        name: "John Doe",
        email,
        password: "randompassword",
      });
    }).rejects.toBeInstanceOf(UsersAlreadyExistsError);
  });
});
