import type { Request, Response } from "express"

const show = async (req: Request, res: Response): Promise<any> => {
  const { fk_id_account } = req

  return res.status(200).json({ fk_id_account: fk_id_account })
}

export default {
  show,
}
