export class getUserDTO {
  id: number
  uid: string
  sign_in_count: number
  current_sign_in_at: Date
  last_sign_in_at: Date
  current_sign_in_ip: string
  last_sign_in_ip: string
  confirmed_at: Date
  name: string
  display_name: string
  email: string
  type: string

  constructor(user: any) {
    this.id = user.id
    this.uid = user.uid
    this.sign_in_count = user.sign_in_count
    this.current_sign_in_at = user.current_sign_in_at
    this.last_sign_in_at = user.last_sign_in_at
    this.current_sign_in_ip = user.current_sign_in_ip
    this.last_sign_in_ip = user.last_sign_in_ip
    this.confirmed_at = user.confirmed_at
    this.name = user.name
    this.display_name = user.display_name
    this.email = user.email
    this.type = user.type
  }
}
