import Db from "../database/connectionManager"

interface ICloudClientToken {
  id: number
  fk_id_account: number
  token: string
  active: boolean
  last_use: Date | null
  created_at: Date
  updated_at: Date
}

export type IUserCreate = Omit<
  ICloudClientToken,
  "id" | "created_at" | "updated_at" | "active" | "last_use"
>
export type ICloudClientTokenUpdate = Omit<
  ICloudClientToken,
  "id" | "created_at"
>

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export default class CloudClientToken {
  static tableName = "cloud_client_token"

  public static async getAll(): Promise<ICloudClientToken[]> {
    const db = Db.getConnection()
    return db(CloudClientToken.tableName)
      .select("*")
      .where({ active: 1 })
      .orderBy("id", "asc")
  }

  public static async getById(id: number): Promise<ICloudClientToken> {
    const db = Db.getConnection()
    return db(CloudClientToken.tableName).where({ id, active: 1 }).first()
  }

  public static async getByToken(token: string): Promise<ICloudClientToken> {
    const db = Db.getConnection()
    return db(CloudClientToken.tableName).where({ token, active: 1 }).first()
  }

  public static async create(clientToken: IUserCreate): Promise<any> {
    const db = Db.getConnection()
    const id = await db(CloudClientToken.tableName).insert({
      ...clientToken,
      created_at: new Date(),
      updated_at: new Date(),
    })
    return id
  }

  public static async update(
    id: number,
    clientToken: ICloudClientTokenUpdate,
  ): Promise<void> {
    const db = Db.getConnection()
    await db(CloudClientToken.tableName)
      .where({ id })
      .update({ ...clientToken, updated_at: new Date() })
  }

  public static async updateLastUsedToNow(token: string): Promise<void> {
    const db = Db.getConnection()
    await db(CloudClientToken.tableName)
      .where({ token })
      .update({ last_use: new Date(), updated_at: new Date() })
  }

  public static async softDelete(id: number): Promise<void> {
    const db = Db.getConnection()
    await db(CloudClientToken.tableName).where({ id }).update({
      active: 0,
      updated_at: new Date(),
    })
  }

  public static async delete(id: number): Promise<void> {
    const db = Db.getConnection()
    await db(CloudClientToken.tableName).where({ id }).delete()
  }
}
