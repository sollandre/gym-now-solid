import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeFetchNeabyGymsUseCase } from "@/use-cases/factories/make-fetch-nearby-gym-use-case";

export async function nearby(req: FastifyRequest, res: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(req.query);

  const fetchNearbyGymsUseCase = makeFetchNeabyGymsUseCase();

  const { results } = await fetchNearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return res.status(200).send({
    gyms: results,
  });
}
