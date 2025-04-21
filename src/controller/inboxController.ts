import type { Request, Response } from "express"

import indexInbox from "../use-cases/inbox/indexInbox"

const show = async (req: Request, res: Response): Promise<any> => {
  const { fk_id_account } = req

  const result = await indexInbox({
    account_id: fk_id_account as string,
  })

  const retorno = result.map((inbox: any) => {
    return {
      id: inbox.id,
      name: inbox.name,
      channel_type: inbox.channel_type,
    }
  })

  return res.status(200).json(retorno)
}

export default {
  show,
}
