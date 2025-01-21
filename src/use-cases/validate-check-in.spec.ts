import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-checkins-repository";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { LateValidationCheckInError } from "./errors/late-check-in-validation-error";

let sut: ValidateCheckInUseCase;
let checkInRepo: InMemoryCheckInsRepository;

describe("Validate Check In Use Case", () => {
  beforeEach(async () => {
    checkInRepo = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInRepo);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to validate check in", async () => {
    const initialCheckIn = await checkInRepo.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const { checkIn } = await sut.execute({
      checkInId: initialCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInRepo.items[0].validated_at).toEqual(expect.any(Date));
  });

  it("should not be able to validate inexistent check in", async () => {
    await checkInRepo.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    await expect(() => {
      return sut.execute({
        checkInId: "inexistent-check-id",
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to validate the check in after 20 min of it's creation", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const initialCheckIn = await checkInRepo.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    vi.advanceTimersByTime(1000 * 60 * 21); //21 minutes

    await expect(() => {
      return sut.execute({
        checkInId: initialCheckIn.id,
      });
    }).rejects.toBeInstanceOf(LateValidationCheckInError);
  });
});
