import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-checkins-repository";
import { FetchUserCheckInHistoryUseCase } from "./fetch-user-check-ins-history";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let checkInRepo: InMemoryCheckInsRepository;
let sut: FetchUserCheckInHistoryUseCase;

describe("Fetch User Check In Use Case", () => {
  beforeEach(async () => {
    checkInRepo = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInHistoryUseCase(checkInRepo);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to fetch check-in history", async () => {
    await checkInRepo.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    await checkInRepo.create({
      gym_id: "gym-02",
      user_id: "user-01",
    });

    const { checkIns } = await sut.execute({ userId: "user-01", page: 1 });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-01" }),
      expect.objectContaining({ gym_id: "gym-02" }),
    ]);
  });

  it("should be able to fetch paginated check-in history", async () => {
    for (let index = 1; index <= 22; index++) {
      await checkInRepo.create({
        gym_id: `gym-${index}`,
        user_id: "user-01",
      });
    }

    const { checkIns } = await sut.execute({ userId: "user-01", page: 2 });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-21" }),
      expect.objectContaining({ gym_id: "gym-22" }),
    ]);
  });
});
