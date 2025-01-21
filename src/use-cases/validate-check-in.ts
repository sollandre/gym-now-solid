import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import dayjs from "dayjs";
import { LateValidationCheckInError } from "./errors/late-check-in-validation-error";

interface ValidateCheckInUseCaseRequest {
  checkInId: string;
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
  constructor(private checkInRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const validationDate = new Date();

    const minutesPassedFromCheckInCreation = dayjs(validationDate).diff(
      checkIn.created_at,
      "minutes",
    );

    if (minutesPassedFromCheckInCreation > 20) {
      throw new LateValidationCheckInError();
    }

    checkIn.validated_at = validationDate;

    await this.checkInRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}
