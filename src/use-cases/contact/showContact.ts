import Contacts from "../../models/Contacts"
import AppError from "../../errors/app.error"

type InputShowContact = {
  id: number
  account_id: number
}

const execute = async ({ id, account_id }: InputShowContact) => {
  const contactExists = await Contacts.getByIdAndAccountID(id, account_id)

  if (!contactExists) {
    throw new AppError("Contact not found", 404)
  }

  return contactExists
}

export default execute
