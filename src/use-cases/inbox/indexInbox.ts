import apiChatwoot from "../../service/apiChatwoot"

type InputListInbox = {
  account_id: string
}

const execute = async ({ account_id }: InputListInbox) => {
  const api = apiChatwoot.getInstance()
  const inboxes = await api.listInboxes({ account_id })
  return inboxes
}

export default execute
