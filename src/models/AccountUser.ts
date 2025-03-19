import Db from "../database/connectionManager"

interface IAccountUser {
  id: number
  account_id?: number
  user_id?: number
  role?: number
  inviter_id?: number
  created_at: Date
  updated_at: Date
  active_at?: Date
  availability: number
  auto_offline: boolean
  custom_role_id?: number
}

export type IAccountUserCreate = Omit<
  IAccountUser,
  "id" | "created_at" | "updated_at"
>
export type IAccountUserUpdate = Omit<IAccountUser, "id" | "updated_at">

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export default class AccountUser {
  static tableName = "account_users"

  public static async getAll(): Promise<IAccountUser[]> {
    const db = Db.getConnection()
    return db(AccountUser.tableName).select("*")
  }

  public static async getById(id: number): Promise<IAccountUser> {
    const db = Db.getConnection()
    return db(AccountUser.tableName).where({ id }).first()
  }

  public static async getByUserId(
    account_id: number,
    user_id: number,
  ): Promise<IAccountUser> {
    const db = Db.getConnection()
    return db(AccountUser.tableName).where({ account_id, user_id }).first()
  }

  public static async create(trip: IAccountUserCreate): Promise<number> {
    const db = Db.getConnection()
    const [id] = await db(AccountUser.tableName).insert(trip)
    return id
  }

  public static async update(
    id: number,
    trip: IAccountUserUpdate,
  ): Promise<void> {
    const db = Db.getConnection()
    await db(AccountUser.tableName).where({ id }).update(trip)
  }

  public static async delete(id: string): Promise<void> {
    const db = Db.getConnection()
    await db(AccountUser.tableName).where({ id }).delete()
  }
}
