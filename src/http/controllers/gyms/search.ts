import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms-use-case";

export async function search(req: FastifyRequest, res: FastifyReply) {
  const searchGymQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { q, page } = searchGymQuerySchema.parse(req.query);

  const searchGymUseCase = makeSearchGymsUseCase();

  const { results } = await searchGymUseCase.execute({
    query: q,
    page,
  });

  return res.status(200).send({
    gyms: results,
  });
}
