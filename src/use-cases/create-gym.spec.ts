import { expect, describe, it, beforeEach } from "vitest";
import { CreateGymUseCase } from "./create-gym";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    const gymRepo = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymRepo);
  });

  it("should be able to create a gym", async () => {
    const { gym } = await sut.execute({
      title: "First Gym",
      latitude: -27.2092052,
      longitude: -49.6401091,
      description: null,
      phone: null,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
