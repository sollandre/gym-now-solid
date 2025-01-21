import { Prisma, Gym } from "@prisma/client";
import { FindManyNearbyParams, GymsRepository } from "../gyms-repository";
import { randomUUID } from "crypto";
import { Decimal } from "@prisma/client/runtime/library";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];
  readonly MAX_RESULTS_PER_PAGE = 20 as const;

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const newGym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ? data.description : null,
      phone: data.phone ? data.phone : null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
    };

    this.items.push(newGym);

    return newGym;
  }

  async findById(gymId: string): Promise<Gym | null> {
    const gym = this.items.find((item) => item.id === gymId);

    if (!gym) return null;

    return gym;
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice(
        (page - 1) * this.MAX_RESULTS_PER_PAGE,
        page * this.MAX_RESULTS_PER_PAGE,
      );
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      );

      return distance <= 10;
    });
  }
}
