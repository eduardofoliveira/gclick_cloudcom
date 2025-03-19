import Db from "../database/connectionManager"

interface IUser {
  id: number
  provider: string
  uid: string
  encrypted_password: string
  reset_password_token: string | null
  reset_password_sent_at: Date | null
  remember_created_at: Date | null
  sign_in_count: number
  current_sign_in_at: Date | null
  last_sign_in_at: Date | null
  current_sign_in_ip: string | null
  last_sign_in_ip: string | null
  confirmation_token: string | null
  confirmed_at: Date | null
  confirmation_sent_at: Date | null
  unconfirmed_email: string | null
  name: string
  display_name: string | null
  email: string | null
  tokens: any | null // Use uma interface mais específica se souber a estrutura do JSON
  created_at: Date
  updated_at: Date
  pubsub_token: string | null
  availability: number | null
  ui_settings: any // Use uma interface mais específica se souber a estrutura do JSONB
  custom_attributes: any // Use uma interface mais específica se souber a estrutura do JSONB
  type: string | null
  message_signature: string | null
}

export type IUserCreate = Omit<IUser, "id" | "created_at" | "updated_at">
export type IUserUpdate = Omit<IUser, "id" | "updated_at">

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export default class User {
  static tableName = "users"

  public static async getAll(): Promise<IUser[]> {
    const db = Db.getConnection()
    return db(User.tableName).select("*")
  }

  public static async getById(id: number): Promise<IUser> {
    const db = Db.getConnection()
    return db(User.tableName).where({ id }).first()
  }

  public static async create(trip: IUserCreate): Promise<number> {
    const db = Db.getConnection()
    const [id] = await db(User.tableName).insert(trip)
    return id
  }

  public static async update(id: number, trip: IUserUpdate): Promise<void> {
    const db = Db.getConnection()
    await db(User.tableName).where({ id }).update(trip)
  }

  public static async delete(id: string): Promise<void> {
    const db = Db.getConnection()
    await db(User.tableName).where({ id }).delete()
  }
}
