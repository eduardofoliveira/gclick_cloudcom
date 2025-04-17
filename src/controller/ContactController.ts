import type { Request, Response } from "express"

import showContact from "../use-cases/contact/showContact"

const show = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params
  const { fk_id_account } = req
  const account_id = fk_id_account as string

  const contact = await showContact({
    id: Number.parseInt(id, 10),
    account_id: Number.parseInt(account_id, 10),
  })

  return res.json(contact)
}

export default {
  show,
}
