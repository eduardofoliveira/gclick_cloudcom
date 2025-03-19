import AppError from "../../errors/app.error"
import CloudClientToken from "../../models/CloudClientToken"

type InputShowToken = {
  id: number
}

const execute = async ({ id }: InputShowToken) => {
  const tokens = await CloudClientToken.getById(id)

  if (!tokens) {
    throw new AppError("Token not found", 404)
  }

  return tokens
}

export default { execute }
