import CloudClientToken from "../../models/CloudClientToken"

const execute = async () => {
  const tokens = await CloudClientToken.getAll()
  return tokens
}

export default { execute }
