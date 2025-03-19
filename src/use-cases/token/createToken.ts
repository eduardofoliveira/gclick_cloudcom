import crypto from "node:crypto"

import CloudClientToken from "../../models/CloudClientToken"

type InputShowToken = {
  fk_id_account: number
}

// Função para gerar uma string randômica
function gerarStringRandomica(tamanho: number) {
  return crypto.randomBytes(tamanho).toString("hex")
}

// Função para gerar um hash MD5
function gerarHashMD5(dados: string) {
  return crypto.createHash("md5").update(dados).digest("hex")
}

const execute = async ({ fk_id_account }: InputShowToken) => {
  const stringRandomica = gerarStringRandomica(16)
  let hashMD5 = gerarHashMD5(stringRandomica)

  while (await CloudClientToken.getByToken(hashMD5)) {
    const stringRandomica = gerarStringRandomica(16)
    hashMD5 = gerarHashMD5(stringRandomica)
  }

  await CloudClientToken.create({
    fk_id_account,
    token: hashMD5,
  })

  const tokenCreated = await CloudClientToken.getByToken(hashMD5)

  return {
    token: tokenCreated.token,
  }
}

export default { execute }
