import { useState, useEffect, useRef, useCallback } from "react";
import { fetchToken } from "@/utils/login";
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
import formatDateTime from "./timeFormatter";
import ChatComponent from "./chatComponent";
import { _createNewChannel } from "./fetchers";

const Socket = async () => {
  const { room_id } = useParams();
  const baseUrl = "ws://10.1.1.170:8000/message";
  const didUnmount = useRef(false);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const { isNavbarOpen } = useNavbarContext();
  const [channels, setChannels] = useState([]);
  const [messageErr, flagMessageErr] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [initialCacheLoaded, setInitialCacheLoaded] = useState(false);
  const [messageHistory, setMessageHistory] = useState([]);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDescription, setNewChannelDescription] = useState("");

  const roomsJoined = useSelector(
    (state: RootState) => state.userState.roomsJoined
  );
  const lastVisitedChannel = roomsJoined.find(
    (room) => room.id === room_id
  )?.last_channel_visited;
  const roomName = roomsJoined.find((room) => room.id === room_id)?.room_name;
  const [channelId, setChannelId] = useState(lastVisitedChannel || "");
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    `${baseUrl}/${room_id}?token=${await fetchToken()}`,
    {
      shouldReconnect: () => !didUnmount.current,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
    }
  );

  const scrollRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      if (!room_id) return;
      try {
        const response = await axios.get(
          `http://10.1.1.170:8000/channel/fetch?room_id=${room_id}`,
          {
            headers: {
              Authorization: `Bearer ${await fetchToken()}`,
            },
          }
        );
        setChannels(response.data.channels);
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    };
    fetchChannels();
  }, [room_id]);

  useEffect(() => {
    const fetchChannelMessagesIfNeeded = async () => {
      if (!channelId || !room_id || initialCacheLoaded) return;
      try {
        const response = await axios.get(
          `http://10.1.1.170:8000/message/channel/cache?room_id=${room_id}&channel_id=${channelId}`,
          {
            headers: {
              Authorization: `Bearer ${await fetchToken()}`,
            },
          }
        );
        const cachedMessages = response.data || [];
        const parsedMessages = cachedMessages.reverse().map((msg) => ({
          data: JSON.stringify(msg),
        }));
        setMessageHistory(parsedMessages);
        setInitialCacheLoaded(true);
      } catch (error) {
        console.error("Error fetching cached messages:", error);
      }
    };
    fetchChannelMessagesIfNeeded();
  }, [room_id, channelId, initialCacheLoaded]);

  useEffect(() => {
    if (lastMessage !== null && initialCacheLoaded) {
      const messageData = JSON.parse(lastMessage.data);
      if (messageData.channel_id === channelId) {
        const messageExists = messageHistory.some(
          (msg) => JSON.parse(msg.data).mid === messageData.mid
        );
        if (!messageExists) {
          setMessageHistory((prev) => [...prev, lastMessage]);
          dispatch(decrementRoomNotification(room_id));
        }
      }
    }
  }, [lastMessage, initialCacheLoaded, messageHistory, channelId]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messageHistory]);

  const handleSendMessage = useCallback(async () => {
    if (message.trim()) {
      const newMessage = {
        message,
        room_id,
        channel_id: channelId,
        timestamp: formatDateTime(new Date()),
      };
      try {
        await sendJsonMessage(newMessage);
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      flagMessageErr(true);
    }
  }, [message, sendJsonMessage, room_id, channelId]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    setMessageHistory([]);
    setInitialCacheLoaded(false);
    if (channelId && room_id) {
      const fetchNewChannelMessages = async () => {
        try {
          const response = await axios.get(
            `http://10.1.1.170:8000/message/channel/cache?room_id=${room_id}&channel_id=${channelId}`,
            {
              headers: {
                Authorization: `Bearer ${await fetchToken()}`,
              },
            }
          );
          const cachedMessages = response.data || [];
          const parsedMessages = cachedMessages.reverse().map((msg) => ({
            data: JSON.stringify(msg),
          }));
          setMessageHistory(parsedMessages);
          setInitialCacheLoaded(true);
        } catch (error) {
          console.error("Error fetching cached messages:", error);
        }
      };
      fetchNewChannelMessages();
    }
  }, [channelId, room_id]);

  const handleClick = (newChannelId) => {
    setChannelId(newChannelId);
    dispatch(setLastRoomVisited({ roomId: room_id, channelId: newChannelId }));
  };

  const createNewChannel = async (name, description, roomId) => {
    try {
      const response = await _createNewChannel(name, description, roomId);
      const newChannel = response.data;
      setChannels((prevChannels) => [...prevChannels, newChannel]);
    } catch (error) {
      console.error("Error creating new channel:", error);
    }
  };

  if (!initialCacheLoaded) {
    return <div>Loading...</div>; // Render a loading indicator while data is being fetched
  }
  console.log(messageHistory);
  return (
    <ChatComponent
      message={message}
      roomName={roomName}
      roomId={room_id}
      channels={channels}
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
    />
  );
};

export default Socket;
