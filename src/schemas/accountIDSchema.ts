import { z } from "zod"

export const validateAccountIdSchema = z.object({
  account_id: z
    .string({ required_error: "account_id é obrigatório" })
    .regex(/^\d+$/, { message: "account_id deve conter somente numeros" })
    .transform((val) => Number.parseInt(val, 10))
    .refine(
      (val) => Number.isInteger(val) && val > 0, // Valida se é um número inteiro positivo
      {
        message: "account_id deve ser um numero inteiro válido", // Mensagem de erro personalizada
      },
    ),
})
