import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymRepo: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(async () => {
    gymRepo = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymRepo);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to fetch nearby gyms", async () => {
    await gymRepo.create({
      title: "Near Gym",
      latitude: -27.2092052,
      longitude: -49.6401091,
    });

    await gymRepo.create({
      title: "Far Gym",
      latitude: 0,
      longitude: 0,
    });

    const { results } = await sut.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    });

    expect(results).toHaveLength(1);
    expect(results).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
