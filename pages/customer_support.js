import { useMemo, useState } from 'react';
import { Stack, Group } from '@mantine/core';
import { useDatabaseSnapshot } from "@react-query-firebase/database";
import { getChatsRef, addChatMessage, toArray, deleteAllChatMessages } from '../lib/clientDb';
import { generateNameFromSeed } from '../lib/utils';
import ChatList from '../components/chat/ChatList';
import MessageList from '../components/chat/MessageList';
import LocateTrolleyModal from '../components/map/LocateTrolleyModal';

export default function CustomerSupport() {

  const [selectedUserChat, setSelectedUserChat] = useState(undefined);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationTrolleyId, setLocationTrolleyId] = useState(undefined);

  const chatsRef = getChatsRef();
  const chatsQuery = useDatabaseSnapshot(["chats"], chatsRef,
  {
      subscribe: true,
  },
      {
          select: (result) => {
              const chats = toArray(result).map((user) => {
                const messages = user.messages ? Object.keys(user.messages).map((messageId) =>  {
                  const message = user.messages[messageId];
                  return {
                    ...message,
                    id: messageId,
                    dateCreated: new Date(message.dateCreated)
                  }
                }) : [];
                messages.sort((a, b) => {
                  return a.dateCreated - b.dateCreated;
                })
                return {
                  ...user,
                  name: generateNameFromSeed(user.id) + '-customer',
                  messages
                }
              });
              return chats;
          },
          refetchOnMount: "always",
  });

  const chats = useMemo(() => {
    return chatsQuery.data ? chatsQuery.data : [];
  }, [chatsQuery.data]) 

  const chatUsers = chats.map((user) => {
    const latestMessage = user.messages.length > 0 ? user.messages[user.messages.length - 1] : null;
    return {
        id: user.id,
        name: user.name,
        subtitle: latestMessage ? latestMessage.content : '',
        latestDate: latestMessage ? latestMessage.dateCreated : null
    }
  });

  const userMessages = useMemo(() => {
    const user = chats.find((user) => {
      return selectedUserChat ? user.id === selectedUserChat.id : false
    })
    return user ?
      user.messages.map((message) => {
        const isUser = message.sender === "user";
        return {
          position: isUser ? "left" : "right",
          ...message
        }
      })
      :
      [];
  }, [chats, selectedUserChat]);

  const onSendMessage = (message) => {
    addChatMessage(selectedUserChat.id, {
      sender: 'admin',
      content: message,
    }, (messageId) => {
      // Success
    }, (error) => {
      console.log(error);
    })
  }

  const onDeleteAllMessages = () => {
    deleteAllChatMessages(selectedUserChat.id,
      () => {
        setSelectedUserChat(undefined)
    }, (error) => {
      console.log(error);
    });
  }

  const onLocateTrolley = (trolleyId) => {
    setShowLocationModal(true)
    setLocationTrolleyId(trolleyId)
  }

  return (
    <Stack style={{
      width: '100%',
      height: '100%'
    }}>
      <LocateTrolleyModal show={showLocationModal} setShow={setShowLocationModal} trolleyId={locationTrolleyId} />
      <Group style={{
          width: '100%',
          height: '100%'
        }}
        align='flex-start'
        position='center'
        noWrap
        spacing={4}
      >
        <ChatList
          style={{
            flex: 1
          }}
          loading={chatsQuery.isLoading}
          data={chatUsers}
          selectedUser={selectedUserChat}
          onClick={(user) => {
            setSelectedUserChat(user)
          }}
        />
        <MessageList
          style={{
            flex: 2,
            height: '80vh',
          }}
          disabled={!selectedUserChat}
          data={userMessages}
          selectedUser={selectedUserChat}
          onSend={onSendMessage}
          onDeleteAll={onDeleteAllMessages}
          onLocateTrolley={onLocateTrolley}
        />
      </Group>
    </Stack>
  )
}
