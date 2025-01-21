import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SearchGymsUseCase } from "./search-gyms";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

let gymRepo: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Search Gyms Use Case", () => {
  beforeEach(async () => {
    gymRepo = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymRepo);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to search for gyms", async () => {
    await gymRepo.create({
      title: "Javascript Gym",
      latitude: -27.2092052,
      longitude: -49.6401091,
    });

    await gymRepo.create({
      title: "Typescript Gym",
      latitude: -27.2092052,
      longitude: -49.6401091,
    });

    const { results } = await sut.execute({ query: "Javascript", page: 1 });

    expect(results).toHaveLength(1);
    expect(results).toEqual([
      expect.objectContaining({ title: "Javascript Gym" }),
    ]);
  });

  it("should be able to fetch paginated gym search", async () => {
    for (let index = 1; index <= 22; index++) {
      await gymRepo.create({
        id: `gym-${index}`,
        title: `Gym ${index}`,
        latitude: -27.2092052,
        longitude: -49.6401091,
      });
    }

    const { results } = await sut.execute({ query: "Gym", page: 2 });

    expect(results).toHaveLength(2);
    expect(results).toEqual([
      expect.objectContaining({ title: "Gym 21" }),
      expect.objectContaining({ title: "Gym 22" }),
    ]);
  });
});
