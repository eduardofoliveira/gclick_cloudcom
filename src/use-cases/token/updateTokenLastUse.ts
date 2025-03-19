import AppError from "../../errors/app.error"
import CloudClientToken from "../../models/CloudClientToken"

type InputShowToken = {
  token: string
}

const execute = async ({ token }: InputShowToken) => {
  const tokens = await CloudClientToken.getByToken(token)

  if (!tokens) {
    throw new AppError("Token not found", 404)
  }

  await CloudClientToken.updateLastUsedToNow(token)

  return tokens
}

export default { execute }
