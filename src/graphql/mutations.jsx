import { gql } from '@apollo/client'

// Create a new chat
export const CREATE_CHAT = gql`
  mutation CreateChat($name: String!) {
    insert_chats_one(object: { name: $name }) {
      id
      name
      created_at
    }
  }
`

// Delete a chat (and cascade delete messages in DB)
export const DELETE_CHAT = gql`
  mutation DeleteChat($chatId: uuid!) {
    delete_chats_by_pk(id: $chatId) {
      id
    }
  }
`

// Update chat (if you need renaming feature later)
export const UPDATE_CHAT = gql`
  mutation UpdateChat($chatId: uuid!, $newName: String!) {
    update_chats_by_pk(
      pk_columns: { id: $chatId }
      _set: { name: $newName }
    ) {
      id
      name
    }
  }
`

// Insert a user message
export const INSERT_USER_MESSAGE = gql`
  mutation InsertUserMessage($chatId: uuid!, $content: String!) {
    insert_messages_one(
      object: { chat_id: $chatId, sender: "user", content: $content }
    ) {
      id
      sender
      content
      created_at
    }
  }
`

// Call Hasura Action to send message (n8n workflow)
export const SEND_MESSAGE_ACTION = gql`
  mutation SendMessage(
    $chatId: uuid!
    $content: String!
    $history: json!
  ) {
    sendMessage(chat_id: $chatId, content: $content, history: $history)
  }
`;

// Delete a specific message
export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($messageId: uuid!) {
    delete_messages_by_pk(id: $messageId) {
      id
    }
  }
`

// Update a message (if you allow edits)
export const UPDATE_MESSAGE = gql`
  mutation UpdateMessage($messageId: uuid!, $newContent: String!) {
    update_messages_by_pk(
      pk_columns: { id: $messageId }
      _set: { content: $newContent }
    ) {
      id
      content
      updated_at
    }
  }
`
