import type { Request, Response } from "express"
import { isAfter, isBefore } from "date-fns"
import axios from "axios"
import { z } from "zod"

import sendMessage from "../use-cases/message/sendMessage"
import sendFile from "../use-cases/message/sendFile"

// Verificar se dataMensagem está entre dataInicio e dataFim usando date-fns
const isBetweenDates = (
  dataMensagem: Date,
  dataInicio: Date,
  dataFim: Date,
) => {
  return isAfter(dataMensagem, dataInicio) && isBefore(dataMensagem, dataFim)
}

const show = async (req: Request, res: Response): Promise<any> => {
  try {
    const { conversation_id } = req.params
    const { fk_id_account } = req
    const account_id = fk_id_account as string

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

const showByContact = async (req: Request, res: Response): Promise<any> => {
  try {
    const { contact_id } = req.params
    const { start, end } = req.query
    const { fk_id_account } = req
    const account_id = fk_id_account as string

    // validar start e end com zod
    const schema = z.object({
      start: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
        message:
          "Invalid date, field start is required, format: YYYY-MM-DD HH:mm:ss",
      }),
      end: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
        message:
          "Invalid date, field end is required, format: YYYY-MM-DD HH:mm:ss",
      }),
    })

    schema.parse({
      start,
      end,
    })

    let { data } = await axios.get(
      `https://chatwoot.cloudcom.com.br/api/v1/accounts/${account_id}/contacts/${contact_id}/conversations`,
      {
        headers: {
          api_access_token: process.env.TOKEN_CHATWOOT,
        },
      },
    )

    const dataInicio = new Date(start as string)
    const dataFim = new Date(end as string)

    data = data.payload.filter((item: any) => {
      const dataMensagem = new Date(item.timestamp * 1000)
      return isBetweenDates(dataMensagem, dataInicio, dataFim)
    })

    return res.json(data)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: error.errors.map((err) => err),
      })
    }

    return res.status(500).json({ error: error.message })
  }
}

const store = async (req: Request, res: Response): Promise<any> => {
  const { fk_id_account } = req
  const account_id = fk_id_account as string
  const { destination, message, inbox_id } = req.body

  const result = await sendMessage({
    account_id: Number.parseInt(account_id, 10),
    destination,
    message,
    inbox_id,
  })

  return res.json(result)
}

const storeFile = async (req: Request, res: Response): Promise<any> => {
  const { destination, inbox_id } = req.body
  const { fk_id_account } = req
  const account_id = fk_id_account as string

  const result = await sendFile({
    account_id: Number.parseInt(account_id, 10),
    destination,
    file: req.file as Express.Multer.File,
    inbox_id,
  })

  return res.json(result)
}

const showAllMessagesByContact = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { contact_id } = req.params
  const { start, end } = req.query
  const { fk_id_account } = req
  const account_id = fk_id_account as string

  // validar start e end com zod
  const schema = z.object({
    start: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
      message:
        "Invalid date, field start is required, format: YYYY-MM-DD HH:mm:ss",
    }),
    end: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
      message:
        "Invalid date, field end is required, format: YYYY-MM-DD HH:mm:ss",
    }),
  })

  schema.parse({
    start,
    end,
  })

  const { data: conversations } = await axios.get(
    `https://chatwoot.cloudcom.com.br/api/v1/accounts/${account_id}/contacts/${contact_id}/conversations`,
    {
      headers: {
        api_access_token: process.env.TOKEN_CHATWOOT,
      },
    },
  )

  const returnMessages = []
  for await (const conversation of conversations.payload) {
    const { data: messages } = await axios.get(
      `https://chatwoot.cloudcom.com.br/api/v1/accounts/${account_id}/conversations/${conversation.id}/messages`,
      {
        headers: {
          api_access_token: process.env.TOKEN_CHATWOOT,
        },
      },
    )

    const dataInicio = new Date(start as string)
    const dataFim = new Date(end as string)

    const filteredMessages = messages.payload.filter((item: any) => {
      const dataMensagem = new Date(item.created_at * 1000)
      return isBetweenDates(dataMensagem, dataInicio, dataFim)
    })

    returnMessages.push(...filteredMessages)
  }

  const messagesOrdered = returnMessages.sort((a: any, b: any) => {
    if (a.created_at > b.created_at) {
      return -1
    }
    if (a.created_at < b.created_at) {
      return 1
    }
    return 0
  })

  return res.json(messagesOrdered)
}

export default {
  show,
  showByContact,
  showAllMessagesByContact,
  store,
  storeFile,
}
