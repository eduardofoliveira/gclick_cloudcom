import { z } from "zod"

export const validateInboxIdSchema = z.object({
  inbox_id: z
    .string({ required_error: "inbox_id é obrigatório" })
    .regex(/^\d+$/, { message: "inbox_id deve conter somente numeros" })
    .transform((val) => Number.parseInt(val, 10))
    .refine(
      (val) => Number.isInteger(val) && val > 0, // Valida se é um número inteiro positivo
      {
        message: "inbox_id deve ser um numero inteiro válido", // Mensagem de erro personalizada
      },
    ),
})
