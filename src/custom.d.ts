// Extend the Request interface to include fk_id_account
declare namespace Express {
  interface Request {
    fk_id_account?: string
  }
}
