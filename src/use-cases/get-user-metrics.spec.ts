import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-checkins-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let checkInRepo: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe("Get User Metrics Use Case", () => {
  beforeEach(async () => {
    checkInRepo = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInRepo);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to get user's number of checkins from metrics", async () => {
    await checkInRepo.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    await checkInRepo.create({
      gym_id: "gym-02",
      user_id: "user-01",
    });

    const { checkInCount } = await sut.execute({ userId: "user-01" });

    expect(checkInCount).toEqual(2);
  });
});
