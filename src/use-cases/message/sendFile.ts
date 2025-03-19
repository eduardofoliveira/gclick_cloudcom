import AppError from "../../errors/app.error"
import Conversation from "../../models/Conversation"
import Contacts from "../../models/Contacts"
import apiChatwoot from "../../service/apiChatwoot"

type InputSendMessage = {
  destination: number
  file: Express.Multer.File
  account_id: number
}

const execute = async ({ account_id, destination, file }: InputSendMessage) => {
  const findConversations = await Conversation.findConversation({
    accountId: account_id,
    phoneNumber: destination.toString(),
  })

  if (findConversations.length > 0) {
    const api = apiChatwoot.getInstance()
    const data = await api.sendFile({
      account_id: account_id.toString(),
      conversation_id: findConversations[0].display_id,
      file,
    })

    return data
  }

  const contactExists = await Contacts.findContactByPhoneNumber({
    account_id: account_id,
    phoneNumber: destination.toString(),
  })

  if (!contactExists.length) {
    throw new AppError("Contact not found", 404)
  }

  const api = apiChatwoot.getInstance()
  const { id } = await api.createConversation({
    account_id: account_id.toString(),
    contact_id: contactExists[0].id.toString(),
    inbox_id: "4",
  })

  const data = await api.sendFile({
    account_id: account_id.toString(),
    conversation_id: findConversations[0].display_id,
    file,
  })

  return data
}

export default execute
