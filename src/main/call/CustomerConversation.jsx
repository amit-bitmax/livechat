import React, { useState } from 'react';
import ChatBox from './ChatBot';
import StartConversation from './StartConversation';


export default function CustomerChat() {
  const [conversationId, setConversationId] = useState(null);

  return (
    <>
      {!conversationId ? (
        <StartConversation onStart={(id) => setConversationId(id)} />
      ) : (
        <ChatBox conversationId={conversationId} />
      )}
    </>
  );
}
