import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";
import { CheckInUseCase } from "./check-in";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-checkins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-checkins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

let sut: CheckInUseCase;
let gymsRepo: InMemoryGymsRepository;

describe("Check In Use Case", () => {
  beforeEach(async () => {
    const checkInRepo = new InMemoryCheckInsRepository();
    gymsRepo = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInRepo, gymsRepo);

    await gymsRepo.create({
      id: "gym-01",
      title: "Gym of the first",
      latitude: new Decimal(20),
      longitude: new Decimal(20),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 20,
      userLongitude: 20,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 20,
      userLongitude: 20,
    });

    await expect(() => {
      return sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: 20,
        userLongitude: 20,
      });
    }).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to check in twice in different days", async () => {
    const day = 1;

    vi.setSystemTime(new Date(2024, 0, day, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 20,
      userLongitude: 20,
    });

    vi.setSystemTime(new Date(2024, 0, day + 1, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 20,
      userLongitude: 20,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    const gym = await gymsRepo.create({
      title: "Gym of the first",
      latitude: 20,
      longitude: 20,
    });

    await expect(() => {
      return sut.execute({
        gymId: gym.id,
        userId: "user-01",
        userLatitude: 0,
        userLongitude: 0,
      });
    }).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
