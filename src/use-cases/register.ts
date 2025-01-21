import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UsersAlreadyExistsError } from "./errors/user-already-exists-error";
import type { User } from "@prisma/client";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUserCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUserCaseResponse> {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UsersAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    return {
      user,
    };
  }
}
