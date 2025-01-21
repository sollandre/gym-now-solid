import { FastifyRequest, FastifyReply } from "fastify";
import { makeGetUserMetricsUseCase } from "@/use-cases/factories/make-get-user-metrics-use-case";

export async function metrics(req: FastifyRequest, res: FastifyReply) {
  const getUserMetricsUseCase = makeGetUserMetricsUseCase();

  const { checkInCount } = await getUserMetricsUseCase.execute({
    userId: req.user.sub,
  });

  return res.status(200).send({
    checkInCount,
  });
}
