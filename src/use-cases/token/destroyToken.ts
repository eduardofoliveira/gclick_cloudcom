import AppError from "../../errors/app.error"
import CloudClientToken from "../../models/CloudClientToken"

type InputShowToken = {
  id: number
}

const execute = async ({ id }: InputShowToken) => {
  const token = await CloudClientToken.getById(id)

  if (!token) {
    throw new AppError("Token not found", 404)
  }

  await CloudClientToken.softDelete(id)
}

export default { execute }
