import type { Request, Response } from "express"

import createToken from "../use-cases/token/createToken"
import indexToken from "../use-cases/token/indexToken"
import showToken from "../use-cases/token/showToken"
import destroyToken from "../use-cases/token/destroyToken"

const index = async (req: Request, res: Response): Promise<any> => {
  try {
    const tokens = await indexToken.execute()
    return res.json(tokens)
  } catch (error: any) {
    return res.status(400).json({ message: error.message })
  }
}

const show = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params
    const tokens = await showToken.execute({ id: Number(id) })
    return res.json(tokens)
  } catch (error: any) {
    return res.status(400).json({ message: error.message })
  }
}

const store = async (req: Request, res: Response): Promise<any> => {
  try {
    const { fk_id_account } = req.body

    const tokenCreated = await createToken.execute({ fk_id_account })

    return res.status(201).json(tokenCreated)
  } catch (error: any) {
    return res.status(400).json({ message: error.message })
  }
}

const destroy = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params
    await destroyToken.execute({ id: Number(id) })
    return res.json({ message: "Token deleted" })
  } catch (error: any) {
    return res.status(400).json({ message: error.message })
  }
}

export default {
  index,
  show,
  store,
  destroy,
}
