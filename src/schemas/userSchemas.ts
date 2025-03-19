import { z } from "zod"

export const searchByIDSchema = z.object({
  id: z
    .string({ required_error: "id é obrigatório" })
    .regex(/^\d+$/, { message: "id deve conter somente numeros" })
    .transform((val) => Number.parseInt(val, 10))
    .refine(
      (val) => Number.isInteger(val) && val > 0, // Valida se é um número inteiro positivo
      {
        message: "id deve ser um numero inteiro válido", // Mensagem de erro personalizada
      },
    ),
})
