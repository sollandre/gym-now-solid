import { expect, describe, it, beforeEach } from "vitest";
import InMemoryUsersRepository from "@/repositories/in-memory/in-memory-users-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { hash } from "bcryptjs";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let usersRepo: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("GetUserProfile Use Case", () => {
  beforeEach(() => {
    usersRepo = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepo);
  });

  it("should be able to get user profile", async () => {
    const password = "genericpassword";

    const createdUser = await usersRepo.create({
      name: "John Doe",
      email: "johndoe@email.com",
      password_hash: await hash(password, 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.id).toEqual(createdUser.id);
  });

  it("should not be able to get user with wrong id", async () => {
    const password = "genericpassword";
    const id = "randomuuid";

    await usersRepo.create({
      name: "John Doe",
      email: "johndoe@email.com",
      password_hash: await hash(password, 6),
    });

    await expect(() => {
      return sut.execute({
        userId: id,
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
