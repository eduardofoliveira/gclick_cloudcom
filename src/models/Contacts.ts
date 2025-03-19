import Db from "../database/connectionManager"

interface AdditionalAttributes {
  string: [string]
}

interface CustomAttributes {
  string: [string]
}

interface IContact {
  id: number
  name: string | null
  email: string | null
  phone_number: string | null
  account_id: number
  created_at: Date
  updated_at: Date
  additional_attributes: AdditionalAttributes // Substitui "any" pela interface específica
  identifier: string | null
  custom_attributes: CustomAttributes // Substitui "any" pela interface específica
  last_activity_at: Date | null
  contact_type: number | null
  middle_name: string | null
  last_name: string | null
  location: string | null
  country_code: string | null
  blocked: boolean
}

type findContactByPhoneNumber = {
  account_id: number
  phoneNumber: string
}

export type IContactCreate = Omit<IContact, "id" | "created_at" | "updated_at">
export type IContactUpdate = Omit<IContact, "id" | "updated_at">

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export default class Contact {
  static tableName = "contacts"

  public static async getAll(): Promise<IContact[]> {
    const db = Db.getConnection()
    return db(Contact.tableName).select("*")
  }

  public static async getById(id: number): Promise<IContact> {
    const db = Db.getConnection()
    return db(Contact.tableName).where({ id }).first()
  }

  public static async getByIdAndAccountID(
    id: number,
    account_id: number,
  ): Promise<IContact> {
    const db = Db.getConnection()
    return db(Contact.tableName).where({ id, account_id }).first()
  }

  public static async findContactByPhoneNumber({
    account_id,
    phoneNumber,
  }: findContactByPhoneNumber): Promise<IContact[]> {
    const db = Db.getConnection()
    const { rows } = await db.raw(`
      SELECT
        *
      FROM
        contacts
      WHERE
        account_id = ${account_id} and
        phone_number IS NOT NULL and
        phone_number LIKE '%${phoneNumber}%'
      ORDER BY
        created_at desc
    `)

    return rows
  }

  public static async create(trip: IContactCreate): Promise<number> {
    const db = Db.getConnection()
    const [id] = await db(Contact.tableName).insert(trip)
    return id
  }

  public static async update(id: number, trip: IContactUpdate): Promise<void> {
    const db = Db.getConnection()
    await db(Contact.tableName).where({ id }).update(trip)
  }

  public static async delete(id: string): Promise<void> {
    const db = Db.getConnection()
    await db(Contact.tableName).where({ id }).delete()
  }
}
