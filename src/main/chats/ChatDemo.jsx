import { useState } from 'react';
import { toast } from 'react-toastify';
import { useSendMessageMutation} from "../../features/chat/chatApi";
import AgentChat from './VideoChat';
import CallHistory from '../call/CallHistory';

const ChatBox = ({ otherUserId }) => {
  const [text, setText] = useState('');
  const [sendMessage] = useSendMessageMutation();

  const handleSend = async () => {
    if (!text) return;
    try {
      await sendMessage({ to: otherUserId, message: text }).unwrap();
      toast.success("Message sent");
      setText('');
    } catch (err) {
      toast.error(err.data?.message || "Send failed");
    }
  };

  return (
    <>
      {/* <VideoSnap/> */}
      {/* <Snapshot/> */}
      {/* <CallPage/> */}
      {/* <CustomerChat/> */}
      {/* <VideoCallRoom/> */}
      <AgentChat/>
      <CallHistory/>
    </>
  );
};

export default ChatBox;
