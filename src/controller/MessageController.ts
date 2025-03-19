import type { Request, Response } from "express"
import axios from "axios"

import sendMessage from "../use-cases/message/sendMessage"
import sendFile from "../use-cases/message/sendFile"

const show = async (req: Request, res: Response): Promise<any> => {
  try {
    const { account_id, conversation_id } = req.params

    const { data } = await axios.get(
      `https://chatwoot.cloudcom.com.br/api/v1/accounts/${account_id}/conversations/${conversation_id}/messages`,
      {
        headers: {
          api_access_token: process.env.TOKEN_CHATWOOT,
        },
      },
    )

    return res.json(data)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}

const store = async (req: Request, res: Response): Promise<any> => {
  const { account_id } = req.params
  const { destination, message } = req.body

  const result = await sendMessage({
    account_id: Number.parseInt(account_id, 10),
    destination,
    message,
  })

  return res.json(result)
}

const storeFile = async (req: Request, res: Response): Promise<any> => {
  const { account_id } = req.params
  const { destination } = req.body

  const result = await sendFile({
    account_id: Number.parseInt(account_id, 10),
    destination,
    file: req.file as Express.Multer.File,
  })

  return res.json(result)
}

export default {
  show,
  store,
  storeFile,
}
