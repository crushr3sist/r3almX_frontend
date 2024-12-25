import { fetchToken } from "@/utils/login";
import routes from "@/utils/routes";
import formatDateTime from "@/utils/timeFormatter";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";

export const useMessageHandling = (
  roomId: string,
  channelId: string,
  SendJsonMessage: (message: any) => void
) => {
  const [message, setMessage] = useState("");
  const [messageErr, flagMessageErr] = useState(false);
  const [messageHistory, setMessageHistory] = useState<MessageEvent<string>[]>(
    []
  );
  const [initialCacheLoaded, setInitialCacheLoaded] = useState(false);

  useEffect(() => {
    const fetchChannelMessages = async () => {
      if (!channelId || !roomId || initialCacheLoaded) return;
      const token = await fetchToken();
      try {
        const response = await axios.get(
          `${routes.channelCache}?room_id=${roomId}&channel_id=${channelId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const parsedMessages = response.data.map((msg) => ({
          data: JSON.stringify(msg),
        }));
        setMessageHistory(parsedMessages);
        setInitialCacheLoaded(true);
      } catch (error) {
        console.error("Error fetching cached messages: ", error);
      }
    };
    fetchChannelMessages();
  }, [roomId, channelId, initialCacheLoaded]);

  const handleSendMessage = useCallback(() => {
    if (message.trim()) {
      const newMessage = {
        message: message.trim(),
        room_id: roomId,
        channel_id: channelId,
        timestamp: formatDateTime(new Date()),
      };
      SendJsonMessage(newMessage);
      setMessage("");
    } else {
      flagMessageErr(true);
    }
  }, [message, SendJsonMessage, roomId, channelId]);

  return {
    message,
    messageErr,
    messageHistory,
    handleSendMessage,
    setMessage,
    flagMessageErr,
  };
};
