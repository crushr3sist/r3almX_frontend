import { useState, useEffect, useRef, useCallback } from "react";

import useWebSocket, { ReadyState } from "react-use-websocket";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/store";

import {
  decrementRoomNotification,
  setLastRoomVisited,
} from "@/state/userSlice";
import { useNavbarContext } from "@/providers/NavbarContext";
import axios from "axios";
import formatDateTime from "../../utils/timeFormatter";
import ChatComponent from "./chatComponent";
import { _createNewChannel } from "../../utils/fetchers";
import routes from "@/utils/routes";
import { fetchToken } from "@/utils/login";
import { useWebSocketConnection } from "./hooks/useWebSocketConnection";
import { useChannelManagement } from "./hooks/useChannelManagement";
import { useMessageHandling } from "./hooks/useMessageHandling";
import { useScrollManagement } from "./hooks/useScrollManagement";

interface SocketProps {
  connection: Worker;
}

const Socket: React.FC<SocketProps> = () => {
  const scrollRef = useRef<HTMLUListElement>(null);
  const { room_id } = useParams();
  const token = localStorage.getItem("token");

  const { connectionStatus, readyState, sendJsonMessage } =
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
    channelSelected,
  } = useChannelManagement(room_id);

  const {
    message,
    messageErr,
    messageHistory,
    handleSendMessage,
    setMessage,
    flagMessageErr,
  } = useMessageHandling(room_id, channelId, sendJsonMessage);

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
      channels={channels}
      channelName={lastVisitedChannelName}
      channelDesc={lastVisitedChannelDesc}
      scrollRef={scrollRef}
      readyState={readyState}
      setMessage={setMessage}
      messageErr={messageErr}
      handleClick={handleClick}
      channelSelected={channelSelected}
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
