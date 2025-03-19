import Db from "../database/connectionManager"

type IFindConversation = {
  phoneNumber: string
  accountId: number
}

type IFindConversationResponse = {
  contact_id: number
  contect_name: string
  phone_number: string
  team_id: number
  team_name: string
  display_id: string
  updated_at: string
}

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export default class Conversation {
  static tableName = "conversations"

  public static async findConversation({
    accountId,
    phoneNumber,
  }: IFindConversation): Promise<IFindConversationResponse[]> {
    const db = Db.getConnection()
    const { rows } = await db.raw(`
      SELECT
        co.id AS contact_id,
        co.name AS contect_name,
        co.phone_number,
        t.id AS team_id,
        t.name AS team_name,
        c.display_id,
        TO_CHAR(c.updated_at, 'DD-MM-YYYY HH24:MI:SS') AS updated_at
      FROM
        conversations c
      LEFT JOIN teams t
        ON t.id = c.team_id,
        contacts co
      WHERE
        c.contact_id = co.id and
        c.account_id = ${accountId} and
        c.status = 0 and
        co.phone_number LIKE '%${phoneNumber}%'
      ORDER BY
        c.updated_at DESC
    `)

    return rows
  }
}
