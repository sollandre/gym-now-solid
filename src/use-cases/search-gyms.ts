import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "@prisma/client";

interface SearchGymsUseCaseRequest {
  query: string;
  page: number;
}

interface SearchGymsUserCaseResponse {
  results: Gym[];
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUserCaseResponse> {
    const results = await this.gymsRepository.searchMany(query, page);

    return {
      results,
    };
  }
}
