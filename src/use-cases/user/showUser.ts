import User from "../../models/User"
import AppError from "../../errors/app.error"

type InputShowUser = {
  id: number
}

const execute = async ({ id }: InputShowUser) => {
  const userExists = await User.getById(id)

  if (!userExists) {
    throw new AppError("User not found", 404)
  }

  return userExists
}

export default execute
