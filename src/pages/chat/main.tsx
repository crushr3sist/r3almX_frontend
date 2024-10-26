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

interface SocketProps {
  connection: Worker;
}

const Socket: React.FC<SocketProps> = ({ connection }) => {
  const { room_id } = useParams();
  const token = localStorage.getItem("token");

  const didUnmount = useRef(false);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const { isNavbarOpen } = useNavbarContext();
  const [channels, setChannels] = useState<any>(null);
  const [messageErr, flagMessageErr] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [initialCacheLoaded, setInitialCacheLoaded] = useState(false);
  const [messageHistory, setMessageHistory] = useState<MessageEvent<string>[]>(
    []
  );
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDescription, setNewChannelDescription] = useState("");

  const roomsJoined = useSelector(
    (state: RootState) => state.userState.roomsJoined
  );

  const lastVisitedChannel = roomsJoined.find(
    (room) => room.id === room_id
  )?.last_channel_visited_id;

  const lastVisitedChannelName = roomsJoined.find(
    (room) => room.id === room_id
  )?.last_channel_visited_name;

  const lastVisitedChannelDesc = roomsJoined.find(
    (room) => room.id === room_id
  )?.last_channel_visited_desc;

  const roomName = roomsJoined.find((room) => room.id === room_id)?.room_name;
  const [channelId, setChannelId] = useState(lastVisitedChannel || "");

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    `${routes.messageSocket}/${room_id}?token=${token}`,
    {
      shouldReconnect: () => !didUnmount.current,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
    }
  );
  const updateRoom = async () => {
    const token = await fetchToken();

    if (!room_id) return;
    try {
      const response = await axios.get(
        `${routes.channelFetch}?room_id=${room_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChannels(response.data.channels);
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  };

  const scrollRef = useRef<HTMLUListElement>(null);

  /**
   * FetchChannels
   * operations:
   *  - check current room_id
   *  - fetch user's channels from backend
   *  - setChannels in component state
   *  - calls itself and watches for the room id or token changes
   */
  useEffect(() => {
    const fetchChannels = async () => {
      if (!room_id) return;
      try {
        const response = await axios.get(
          `${routes.channelFetch}?room_id=${room_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setChannels(response.data.channels);
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    };
    fetchChannels();
  }, [room_id, token]);

  /**
   * fetchChannelMessagesIfNeeded
   * operations:
   *  - checks to see if channelId, room_id or initialCacheLoaded is failed
   *  - fetches the channel's cache
   *  - set's the cached messages before any more messages polled in events
   *  - watches room_id, channelId, token and initialCacheLoaded
   */
  useEffect(() => {
    const fetchChannelMessagesIfNeeded = async () => {
      if (!channelId || !room_id || initialCacheLoaded) return;
      // we're going to observe the effect watchers

      try {
        const response = await axios.get(
          `${routes.channelCache}?room_id=${room_id}&channel_id=${channelId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const cachedMessages = JSON.parse(response.data || []);
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
  }, [room_id, channelId, token, initialCacheLoaded]);

  // Handle new incoming WebSocket messages
  useEffect(() => {
    if (lastMessage !== null && initialCacheLoaded) {
      const messageData = JSON.parse(lastMessage.data);
      const messageExists = messageHistory.some(
        (msg) => JSON.parse(msg.data).mid === messageData.mid
      );

      if (!messageExists) {
        setMessageHistory((prev) => [...prev, lastMessage]);
        dispatch(decrementRoomNotification(room_id));
      }
    }
  }, [lastMessage, initialCacheLoaded, messageHistory, dispatch, room_id]);

  // Scroll to bottom whenever message history updates
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };

    const timeoutId = setTimeout(scrollToBottom, 100);

    return () => clearTimeout(timeoutId);
  }, [messageHistory]);

  // Send message handler
  const handleSendMessage = useCallback(() => {
    if (message.trim()) {
      const newMessage = {
        message: message,
        room_id: room_id,
        channel_id: channelId,
        timestamp: formatDateTime(new Date()),
      };
      sendJsonMessage(newMessage);
      setMessage("");
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

  // Handle channel change and fetch new messages
  useEffect(() => {
    // Reset message history and initialCacheLoaded when channelId or room_id changes
    setMessageHistory([]);
    setInitialCacheLoaded(false);

    if (channelId && room_id) {
      const fetchNewChannelMessages = async () => {
        try {
          const response = await axios.get(
            `${routes.channelCache}?room_id=${room_id}&channel_id=${channelId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const cachedMessages = response.data || [];

          console.log(`${JSON.parse(cachedMessages)}`);
          const parsedMessages = cachedMessages.map((msg) => ({
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
  }, [channelId, room_id, token]);

  // Scroll to bottom whenever message history updates
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };

    const timeoutId = setTimeout(scrollToBottom, 100);

    return () => clearTimeout(timeoutId);
  }, [messageHistory]);

  // Handle channel change and fetch new messages
  const handleClick = (
    newChannelId: string,
    channelName: string,
    channelDesc: string
  ) => {
    setChannelId(newChannelId);
    dispatch(
      setLastRoomVisited({
        roomId: room_id,
        channelId: newChannelId,
        channelName: channelName,
        channelDesc: channelDesc,
      })
    );
  };

  // Function to create a new channel and update the channels state
  const createNewChannel = async (name, description, roomId) => {
    try {
      await _createNewChannel(name, description, roomId);
      await updateRoom();
    } catch (error) {
      console.error("Error creating new channel:", error);
    }
  };

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
