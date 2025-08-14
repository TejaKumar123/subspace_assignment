import { gql } from '@apollo/client'

// Listen for new messages in a chat
export const MESSAGES_SUBSCRIPTION = gql`
  subscription MessagesSubscription($chatId: uuid!) {
    messages(
      where: { chat_id: { _eq: $chatId } }
      order_by: { created_at: asc }
    ) {
      id
      sender
      content
      created_at
    }
  }
`

// Listen for changes in user chat list
export const CHATS_SUBSCRIPTION = gql`
  subscription ChatsSubscription {
    chats(order_by: { created_at: desc }) {
      id
      name
      created_at
    }
  }
`
