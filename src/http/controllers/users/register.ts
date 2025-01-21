import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { UsersAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case";

export async function register(req: FastifyRequest, res: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(req.body);

  try {
    const registerUseCase = makeRegisterUseCase();

    await registerUseCase.execute({
      name,
      email,
      password,
    });

    return res.status(201).send();
  } catch (err) {
    if (err instanceof UsersAlreadyExistsError) {
      return res.status(409).send({ message: err.message });
    }

    throw err;
  }
}
