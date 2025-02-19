import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-checkins-repository";
import { ValidateCheckInUseCase } from "../validate-check-in";

export function makeValidateCheckInUseCase() {
  const checkInRepository = new PrismaCheckInsRepository();
  const useCase = new ValidateCheckInUseCase(checkInRepository);

  return useCase;
}
