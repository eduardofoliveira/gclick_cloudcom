import axios, { AxiosError, AxiosInstance } from "axios"
import FormData from "form-data"
import fs from "node:fs"

type ISendFile = {
  account_id: string
  conversation_id: string
  file: Express.Multer.File
}

type ISendMessage = {
  account_id: string
  conversation_id: string
  message: string
}

type ICreateConversation = {
  inbox_id: string
  contact_id: string
  account_id: string
}

class ApiChatwoot {
  private static instance: ApiChatwoot
  private localAxios: AxiosInstance

  private constructor() {
    this.localAxios = axios.create({
      baseURL: "https://chatwoot.cloudcom.com.br/api/v1",
      headers: {
        api_access_token: process.env.TOKEN_CHATWOOT,
        // Authorization: `Bearer ${process.env.TOKEN_CHATWOOT}`,
      },
    })
  }

  public static getInstance(): ApiChatwoot {
    if (!ApiChatwoot.instance) {
      ApiChatwoot.instance = new ApiChatwoot()
    }
    return ApiChatwoot.instance
  }

  public async sendFile({
    account_id,
    conversation_id,
    file,
  }: ISendFile): Promise<any> {
    const form = new FormData()
    form.append("attachments[]", fs.createReadStream(file.path), {
      filename: file.originalname,
      contentType: file.mimetype,
    })
    form.append("private", "false")

    const options = {
      method: "POST",
      url: `/accounts/${account_id}/conversations/${conversation_id}/messages`,
      headers: {
        "Content-Type": "multipart/form-data",
        ...form.getHeaders(),
      },
      data: form,
    }

    try {
      const { data } = await this.localAxios.request(options)
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(err)
        }
      })
      return data
    } catch (error) {
      console.error(error)
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(err)
        }
      })
      throw error
    }
  }

  public async sendMessage({
    account_id,
    conversation_id,
    message,
  }: ISendMessage): Promise<any> {
    const options = {
      method: "POST",
      url: `/accounts/${account_id}/conversations/${conversation_id}/messages`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        content: message,
        message_type: "outgoing",
        private: false,
      },
    }

    const { data } = await this.localAxios.request(options)

    return data
  }

  public async createConversation({
    account_id,
    contact_id,
    inbox_id,
  }: ICreateConversation): Promise<any> {
    console.log({ account_id, contact_id, inbox_id })

    const options = {
      method: "POST",
      url: `/accounts/${account_id}/conversations`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        inbox_id,
        contact_id,
      },
    }

    try {
      const { data } = await this.localAxios.request(options)
      return data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export default ApiChatwoot
