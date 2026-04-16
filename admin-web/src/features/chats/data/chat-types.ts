export type Convo = {
  senderName: string
  isSelf: boolean
  message: string
  timestamp: string
}

export type ChatUser = {
  id: string
  profile: string
  username: string
  fullName: string
  title: string
  messages: Convo[]
}
