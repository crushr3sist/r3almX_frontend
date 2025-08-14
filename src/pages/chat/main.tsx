import ChatComponent from "./chatComponent";
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavbarContext } from "@/providers/NavbarContext";
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
      // scroll ref
      scrollRef={scrollRef}
      // room id
      roomId={room_id}
      // useWebsocketConnection
      connectionStatus={connectionStatus}
      readyState={readyState}
      // useChannelManagement
      channels={channels}
      channelId={channelId}
      handleClick={handleClick}
      createNewChannel={createNewChannel}
      updateRoom={updateRoom}
      channelName={lastVisitedChannelName}
      channelDesc={lastVisitedChannelDesc}
      roomName={roomName}
      // useMessageHandling
      message={message}
      messageErr={messageErr}
      messageHistory={messageHistory}
      handleSendMessage={handleSendMessage}
      setMessage={setMessage}
      flagMessageErr={flagMessageErr}
      // component hooks
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      isNavbarOpen={isNavbarOpen}
      newChannelName={newChannelName}
      newChannelDescription={newChannelDescription}
      setNewChannelName={setNewChannelName}
      setNewChannelDescription={setNewChannelDescription}
    />
  );
};

export default Socket;
