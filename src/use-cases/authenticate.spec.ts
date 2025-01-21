import { expect, describe, it, beforeEach } from "vitest";
import InMemoryUsersRepository from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let usersRepo: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepo = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepo);
  });

  it("should be able to authenticate", async () => {
    const password = "genericpassword";

    await usersRepo.create({
      name: "John Doe",
      email: "johndoe@email.com",
      password_hash: await hash(password, 6),
    });

    const { user } = await sut.execute({
      email: "johndoe@email.com",
      password: password,
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    const password = "genericpassword";

    await usersRepo.create({
      name: "John Doe",
      email: "johndoe@email.com",
      password_hash: await hash(password, 6),
    });

    await expect(() => {
      return sut.execute({
        email: "johndoe@wrongemail.com",
        password: password,
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    const password = "genericpassword";

    await usersRepo.create({
      name: "John Doe",
      email: "johndoe@email.com",
      password_hash: await hash(password, 6),
    });

    await expect(() => {
      return sut.execute({
        email: "johndoe@wrongemail.com",
        password: "wrongpassword",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
