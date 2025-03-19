import { Request, Response, NextFunction } from "express"

export default function validateAccountId(
  request: Request,
  response: Response,
  next: NextFunction,
): any {
  const { account_id } = request.params
  const { fk_id_account } = request

  if (fk_id_account) {
    if (
      Number.parseInt(fk_id_account, 10) !== Number.parseInt(account_id, 10)
    ) {
      return response
        .status(401)
        .json({ error: "Token does not belong to this client" })
    }
  }

  next()
}
