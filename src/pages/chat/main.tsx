import { useState, useRef } from "react";

import { useParams } from "react-router-dom";

import { useNavbarContext } from "@/providers/NavbarContext";
import ChatComponent from "./chatComponent";
import { useWebSocketConnection } from "./hooks/useWebSocketConnection";
import { useChannelManagement } from "./hooks/useChannelManagement";
import { useMessageHandling } from "./hooks/useMessageHandling";
import { useScrollManagement } from "./hooks/useScrollManagement";

const Socket: React.FC = () => {
  const scrollRef = useRef<HTMLUListElement>(null);
  const { room_id } = useParams();

  const { connectionStatus, readyState, sendJsonMessage, lastMessage } =
    useWebSocketConnection(room_id);

  const {
    channels,
    channelId,
    handleClick,
    createNewChannel,
    updateRoom,
    lastVisitedChannelName,
    lastVisitedChannelDesc,
    roomName,
  } = useChannelManagement(room_id);

  const {
    message,
    messageErr,
    messageHistory,
    handleSendMessage,
    setMessage,
    flagMessageErr,
  } = useMessageHandling(room_id, lastMessage, channelId, sendJsonMessage);

  useScrollManagement(scrollRef, messageHistory);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isNavbarOpen } = useNavbarContext();
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDescription, setNewChannelDescription] = useState("");

  return (
    <ChatComponent
      message={message}
      roomName={roomName}
      roomId={room_id}
      channelId={channelId}
      channels={channels}
      channelName={lastVisitedChannelName}
      channelDesc={lastVisitedChannelDesc}
      scrollRef={scrollRef}
      readyState={readyState}
      setMessage={setMessage}
      messageErr={messageErr}
      handleClick={handleClick}
      isNavbarOpen={isNavbarOpen}
      isSidebarOpen={isSidebarOpen}
      messageHistory={messageHistory}
      flagMessageErr={flagMessageErr}
      connectionStatus={connectionStatus}
      setIsSidebarOpen={setIsSidebarOpen}
      handleSendMessage={handleSendMessage}
      setNewChannelName={setNewChannelName}
      setNewChannelDescription={setNewChannelDescription}
      newChannelName={newChannelName}
      newChannelDescription={newChannelDescription}
      createNewChannel={createNewChannel}
      updateRoom={updateRoom}
    />
  );
};

export default Socket;
