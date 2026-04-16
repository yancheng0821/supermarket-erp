import { type TFunction } from 'i18next'
import { type ChatUser } from './chat-types'

type ConversationSeed = {
  id: string
  profile: string
  username: string
  fullName: string
  titleKey: string
  messages: Array<{
    senderName: string
    isSelf: boolean
    messageKey: string
    timestamp: string
  }>
}

const conversationSeeds: ConversationSeed[] = [
  {
    id: 'conv1',
    profile: 'https://randomuser.me/api/portraits/men/32.jpg',
    username: 'alex_dev',
    fullName: 'Alex John',
    titleKey: 'chats.data.conv1.title',
    messages: [
      {
        senderName: 'Alex',
        isSelf: true,
        messageKey: 'chats.data.conv1.messages.m1',
        timestamp: '2024-08-24T11:15:15',
      },
      {
        senderName: 'Alex',
        isSelf: false,
        messageKey: 'chats.data.conv1.messages.m2',
        timestamp: '2024-08-24T11:11:30',
      },
      {
        senderName: 'Alex',
        isSelf: true,
        messageKey: 'chats.data.conv1.messages.m3',
        timestamp: '2024-08-23T09:26:50',
      },
      {
        senderName: 'Alex',
        isSelf: false,
        messageKey: 'chats.data.conv1.messages.m4',
        timestamp: '2024-08-23T09:25:15',
      },
      {
        senderName: 'Alex',
        isSelf: true,
        messageKey: 'chats.data.conv1.messages.m5',
        timestamp: '2024-08-23T09:24:30',
      },
      {
        senderName: 'Alex',
        isSelf: false,
        messageKey: 'chats.data.conv1.messages.m6',
        timestamp: '2024-08-23T09:23:10',
      },
      {
        senderName: 'Alex',
        isSelf: true,
        messageKey: 'chats.data.conv1.messages.m7',
        timestamp: '2024-08-23T09:22:00',
      },
      {
        senderName: 'Alex',
        isSelf: false,
        messageKey: 'chats.data.conv1.messages.m8',
        timestamp: '2024-08-23T09:21:05',
      },
      {
        senderName: 'Alex',
        isSelf: true,
        messageKey: 'chats.data.conv1.messages.m9',
        timestamp: '2024-08-23T09:20:10',
      },
      {
        senderName: 'Alex',
        isSelf: false,
        messageKey: 'chats.data.conv1.messages.m10',
        timestamp: '2024-08-23T09:19:20',
      },
      {
        senderName: 'Alex',
        isSelf: true,
        messageKey: 'chats.data.conv1.messages.m11',
        timestamp: '2024-08-23T09:18:45',
      },
      {
        senderName: 'Alex',
        isSelf: false,
        messageKey: 'chats.data.conv1.messages.m12',
        timestamp: '2024-08-23T09:17:10',
      },
      {
        senderName: 'Alex',
        isSelf: true,
        messageKey: 'chats.data.conv1.messages.m13',
        timestamp: '2024-08-23T09:16:30',
      },
      {
        senderName: 'Alex',
        isSelf: false,
        messageKey: 'chats.data.conv1.messages.m14',
        timestamp: '2024-08-23T09:15:00',
      },
    ],
  },
  {
    id: 'conv2',
    profile: 'https://randomuser.me/api/portraits/women/45.jpg',
    username: 'taylor.codes',
    fullName: 'Taylor Grande',
    titleKey: 'chats.data.conv2.title',
    messages: [
      {
        senderName: 'Taylor',
        isSelf: false,
        messageKey: 'chats.data.conv2.messages.m1',
        timestamp: '2024-08-23T10:35:00',
      },
      {
        senderName: 'Taylor',
        isSelf: true,
        messageKey: 'chats.data.conv2.messages.m2',
        timestamp: '2024-08-23T10:32:00',
      },
      {
        senderName: 'Taylor',
        isSelf: false,
        messageKey: 'chats.data.conv2.messages.m3',
        timestamp: '2024-08-23T10:30:00',
      },
    ],
  },
  {
    id: 'conv3',
    profile: 'https://randomuser.me/api/portraits/men/54.jpg',
    username: 'john_stack',
    fullName: 'John Doe',
    titleKey: 'chats.data.conv3.title',
    messages: [
      {
        senderName: 'John',
        isSelf: true,
        messageKey: 'chats.data.conv3.messages.m1',
        timestamp: '2024-08-22T18:59:00',
      },
      {
        senderName: 'John',
        isSelf: false,
        messageKey: 'chats.data.conv3.messages.m2',
        timestamp: '2024-08-22T18:55:00',
      },
      {
        senderName: 'John',
        isSelf: true,
        messageKey: 'chats.data.conv3.messages.m3',
        timestamp: '2024-08-22T18:50:00',
      },
      {
        senderName: 'John',
        isSelf: false,
        messageKey: 'chats.data.conv3.messages.m4',
        timestamp: '2024-08-22T18:45:00',
      },
    ],
  },
  {
    id: 'conv4',
    profile: 'https://randomuser.me/api/portraits/women/29.jpg',
    username: 'megan_frontend',
    fullName: 'Megan Flux',
    titleKey: 'chats.data.conv4.title',
    messages: [
      {
        senderName: 'Megan',
        isSelf: true,
        messageKey: 'chats.data.conv4.messages.m1',
        timestamp: '2024-08-23T11:30:00',
      },
      {
        senderName: 'Megan',
        isSelf: false,
        messageKey: 'chats.data.conv4.messages.m2',
        timestamp: '2024-08-23T11:30:00',
      },
      {
        senderName: 'Megan',
        isSelf: true,
        messageKey: 'chats.data.conv4.messages.m3',
        timestamp: '2024-08-23T11:25:00',
      },
      {
        senderName: 'Megan',
        isSelf: false,
        messageKey: 'chats.data.conv4.messages.m4',
        timestamp: '2024-08-23T11:20:00',
      },
    ],
  },
  {
    id: 'conv5',
    profile: 'https://randomuser.me/api/portraits/men/72.jpg',
    username: 'dev_david',
    fullName: 'David Brown',
    titleKey: 'chats.data.conv5.title',
    messages: [
      {
        senderName: 'David',
        isSelf: true,
        messageKey: 'chats.data.conv5.messages.m1',
        timestamp: '2024-08-23T12:00:00',
      },
      {
        senderName: 'David',
        isSelf: false,
        messageKey: 'chats.data.conv5.messages.m2',
        timestamp: '2024-08-23T11:58:00',
      },
      {
        senderName: 'David',
        isSelf: false,
        messageKey: 'chats.data.conv5.messages.m3',
        timestamp: '2024-08-23T11:55:00',
      },
    ],
  },
  {
    id: 'conv6',
    profile: 'https://randomuser.me/api/portraits/women/68.jpg',
    username: 'julia.design',
    fullName: 'Julia Carter',
    titleKey: 'chats.data.conv6.title',
    messages: [
      {
        senderName: 'Julia',
        isSelf: false,
        messageKey: 'chats.data.conv6.messages.m1',
        timestamp: '2024-08-22T14:10:00',
      },
      {
        senderName: 'Julia',
        isSelf: true,
        messageKey: 'chats.data.conv6.messages.m2',
        timestamp: '2024-08-22T14:15:00',
      },
      {
        senderName: 'Julia',
        isSelf: true,
        messageKey: 'chats.data.conv6.messages.m3',
        timestamp: '2024-08-22T14:05:00',
      },
    ],
  },
  {
    id: 'conv7',
    profile: 'https://randomuser.me/api/portraits/men/24.jpg',
    username: 'brad_dev',
    fullName: 'Brad Wilson',
    titleKey: 'chats.data.conv7.title',
    messages: [
      {
        senderName: 'Brad',
        isSelf: false,
        messageKey: 'chats.data.conv7.messages.m1',
        timestamp: '2024-08-23T15:45:00',
      },
      {
        senderName: 'Brad',
        isSelf: true,
        messageKey: 'chats.data.conv7.messages.m2',
        timestamp: '2024-08-23T15:40:00',
      },
      {
        senderName: 'Brad',
        isSelf: false,
        messageKey: 'chats.data.conv7.messages.m3',
        timestamp: '2024-08-23T15:35:00',
      },
    ],
  },
  {
    id: 'conv8',
    profile: 'https://randomuser.me/api/portraits/women/34.jpg',
    username: 'katie_ui',
    fullName: 'Katie Lee',
    titleKey: 'chats.data.conv8.title',
    messages: [
      {
        senderName: 'Katie',
        isSelf: false,
        messageKey: 'chats.data.conv8.messages.m1',
        timestamp: '2024-08-23T09:50:00',
      },
      {
        senderName: 'Katie',
        isSelf: true,
        messageKey: 'chats.data.conv8.messages.m2',
        timestamp: '2024-08-23T09:48:00',
      },
      {
        senderName: 'Katie',
        isSelf: false,
        messageKey: 'chats.data.conv8.messages.m3',
        timestamp: '2024-08-23T09:45:00',
      },
    ],
  },
  {
    id: 'conv9',
    profile: 'https://randomuser.me/api/portraits/men/67.jpg',
    username: 'matt_fullstack',
    fullName: 'Matt Green',
    titleKey: 'chats.data.conv9.title',
    messages: [
      {
        senderName: 'Matt',
        isSelf: false,
        messageKey: 'chats.data.conv9.messages.m1',
        timestamp: '2024-08-23T10:25:00',
      },
      {
        senderName: 'Matt',
        isSelf: true,
        messageKey: 'chats.data.conv9.messages.m2',
        timestamp: '2024-08-23T10:23:00',
      },
      {
        senderName: 'Matt',
        isSelf: false,
        messageKey: 'chats.data.conv9.messages.m3',
        timestamp: '2024-08-23T10:20:00',
      },
    ],
  },
  {
    id: 'conv10',
    profile: 'https://randomuser.me/api/portraits/women/56.jpg',
    username: 'sophie_dev',
    fullName: 'Sophie Alex',
    titleKey: 'chats.data.conv10.title',
    messages: [
      {
        senderName: 'Sophie',
        isSelf: true,
        messageKey: 'chats.data.conv10.messages.m1',
        timestamp: '2024-08-23T16:10:00',
      },
      {
        senderName: 'Sophie',
        isSelf: false,
        messageKey: 'chats.data.conv10.messages.m2',
        timestamp: '2024-08-23T16:05:00',
      },
      {
        senderName: 'Sophie',
        isSelf: false,
        messageKey: 'chats.data.conv10.messages.m3',
        timestamp: '2024-08-23T16:00:00',
      },
    ],
  },
]

export function getChatConversations(t: TFunction): ChatUser[] {
  return conversationSeeds.map((conversation) => ({
    id: conversation.id,
    profile: conversation.profile,
    username: conversation.username,
    fullName: conversation.fullName,
    title: t(conversation.titleKey),
    messages: conversation.messages.map((message) => ({
      senderName: message.isSelf ? t('chats.selfName') : message.senderName,
      isSelf: message.isSelf,
      message: t(message.messageKey),
      timestamp: message.timestamp,
    })),
  }))
}
