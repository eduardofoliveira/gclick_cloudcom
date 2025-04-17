import type { Request, Response } from "express"
import axios from "axios"

const index = async (req: Request, res: Response): Promise<any> => {
  try {
    const { fk_id_account } = req
    const account_id = fk_id_account as string
    const { assignee_type, status, q, inbox_id, team_id, labels, page } =
      req.query

    const { data } = await axios.get(
      `https://chatwoot.cloudcom.com.br/api/v1/accounts/${account_id}/conversations`,
      {
        params: {
          assignee_type,
          status,
          q,
          inbox_id,
          team_id,
          labels,
          page,
        },
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

export default {
  index,
}
