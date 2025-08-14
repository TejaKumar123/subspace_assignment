import { gql } from '@apollo/client'

// Fetch all chats for logged-in user
export const GET_USER_CHATS = gql`
  query GetUserChats {
    chats(order_by: { created_at: desc }) {
      id
      created_at
      name
    }
  }
`

// Fetch messages for a specific chat
export const GET_CHAT_MESSAGES = gql`
  query GetChatMessages($chatId: uuid!) {
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
