import Db from "../database/connectionManager"

interface ICloudTokenLog {
  id: number
  token?: string
  status?: string
  message?: string
  query?: string
  request_body?: string
  request_method?: string
  url?: string
  ip?: string
  headers?: string
  created_at: Date
  updated_at: Date
}

export type ICloudTokenLogCreate = Omit<
  ICloudTokenLog,
  "id" | "created_at" | "updated_at"
>
// export type ICloudTokenLogUpdate = Omit<ICloudTokenLog, "id" | "created_at">

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export default class CloudTokenLog {
  static tableName = "cloud_token_log"

  public static async getAll(): Promise<ICloudTokenLog[]> {
    const db = Db.getConnection()
    return db(CloudTokenLog.tableName).select("*").orderBy("id", "asc")
  }

  public static async getById(id: number): Promise<ICloudTokenLog> {
    const db = Db.getConnection()
    return db(CloudTokenLog.tableName).where({ id }).first()
  }

  public static async listByToken(token: string): Promise<ICloudTokenLog[]> {
    const db = Db.getConnection()
    return db(CloudTokenLog.tableName)
      .select("*")
      .where({ token })
      .orderBy("id", "asc")
  }

  public static async create(clientToken: ICloudTokenLogCreate): Promise<any> {
    const db = Db.getConnection()
    const id = await db(CloudTokenLog.tableName).insert({
      ...clientToken,
      created_at: new Date(),
      updated_at: new Date(),
    })
    return id
  }

  public static async delete(id: number): Promise<void> {
    const db = Db.getConnection()
    await db(CloudTokenLog.tableName).where({ id }).delete()
  }
}
