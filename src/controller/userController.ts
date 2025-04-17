import type { Request, Response } from "express"

import showUser from "../use-cases/user/showUser"
import showAccountUserByUserId from "../use-cases/accountUser/showAccountUserByUserId"
import { getUserDTO } from "../dtos/getUserDTO"

const show = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params
  const { fk_id_account } = req
  const account_id = fk_id_account as string

  await showAccountUserByUserId({
    user_id: Number.parseInt(id, 10),
    account_id: Number.parseInt(account_id, 10),
  })

  const user = await showUser({
    id: Number.parseInt(id, 10),
  })

  return res.json(new getUserDTO(user))
}

export default {
  show,
}
