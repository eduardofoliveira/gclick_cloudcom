import { Request, Response, NextFunction } from "express"

import cloudTokenLog from "../models/CloudTokenLog"
import findByToken from "../use-cases/token/findByToken"
import updateTokenLastUse from "../use-cases/token/updateTokenLastUse"

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response<any, Record<string, any>> | any => {
  try {
    res.on("finish", () => {
      try {
        cloudTokenLog.create({
          token: req.header("Authorization")?.replace("Bearer ", "") ?? "",
          status: String(res.statusCode),
          message: res.statusMessage,
          query: JSON.stringify(req.query),
          request_body: JSON.stringify(req.body),
          request_method: req.method,
          url: req.url,
          ip: req.ip,
          headers: JSON.stringify(req.headers),
        })
      } catch (error) {
        console.error("Error on create log", error)
      }
    })

    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      throw new Error("Invalid Token format")
    }

    findByToken
      .execute({
        token,
      })
      .then((tokenExists) => {
        const { fk_id_account } = tokenExists
        req.fk_id_account = String(fk_id_account)

        if (!tokenExists) {
          return res.status(401).json({ error: "Invalid Token" })
        }

        updateTokenLastUse.execute({ token })
        next()
      })
      .catch(() => {
        return res.status(401).json({ error: "Invalid Token" })
      })
  } catch (error) {
    return res.status(401).json({ error: "Please authenticate" })
  }
}
