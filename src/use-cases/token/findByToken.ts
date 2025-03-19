import AppError from "../../errors/app.error"
import CloudClientToken from "../../models/CloudClientToken"

type InputShowToken = {
  token: string
}

const execute = async ({ token }: InputShowToken) => {
  const findToken = await CloudClientToken.getByToken(token)

  if (!findToken) {
    throw new AppError("Token not found", 404)
  }

  return findToken
}

export default { execute }
