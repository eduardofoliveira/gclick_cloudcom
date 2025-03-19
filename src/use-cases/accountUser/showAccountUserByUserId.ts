import AccountUser from "../../models/AccountUser"
import AppError from "../../errors/app.error"

type Input = {
  account_id: number
  user_id: number
}

const execute = async ({ account_id, user_id }: Input) => {
  const userExists = await AccountUser.getByUserId(account_id, user_id)

  if (!userExists) {
    throw new AppError("User not found", 404)
  }

  return userExists
}

export default execute
