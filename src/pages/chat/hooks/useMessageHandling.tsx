import { fetchToken } from "@/utils/login";
import routes from "@/utils/routes";
import formatDateTime from "@/utils/timeFormatter";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

/**
 * The `useMessageHandling` function in TypeScript React manages message handling for a chat room, including sending messages, fetching message history, and handling message errors.
 * @param {string} roomId - The `roomId` parameter is a string that represents the unique identifier of the room where messages are being exchanged.
 * @param {any} lastMessage - The `lastMessage` parameter in the `useMessageHandling` hook represents the most recent message received in the chat room. It is used to update the message history and display new messages in the chat interface.
 * @param {string} channelId - The `channelId` parameter in the `useMessageHandling` hook represents the unique identifier of the channel where messages are being sent and received. It helps in identifying the specific channel within a room where messages are exchanged.
 * @param sendJsonMessage - The `sendJsonMessage` parameter is a function that takes a message object as an argument and sends it to a specific channel. It is used in the `handleSendMessage` function to send the message typed by the user in the chat room.
 * @returns The `useMessageHandling` hook is returning an object with the following properties:
 */
export const useMessageHandling = (
  roomId: string,
  lastMessage: MessageEvent<any>,
  channelId: string,
  sendJsonMessage: (message: any) => void
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
        if (response.data.status_code !== 500) {
          const parsedMessages = response.data.map((msg) => ({
            data: JSON.stringify(msg),
          }));

          // Sort the initial messages by timestamp
          const sortedMessages = parsedMessages.sort((a, b) => {
            // Parse the data payloads to access the timestamp
            const msgA = JSON.parse(a.data);
            const msgB = JSON.parse(b.data);

            // Compare timestamps
            const timeA = new Date(msgA.timestamp).getTime();
            const timeB = new Date(msgB.timestamp).getTime();

            return timeA - timeB; // Ascending order (oldest first)
          });

          setMessageHistory(sortedMessages);
          setInitialCacheLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching cached messages: ", error);
      }
    };
    fetchChannelMessages();
  }, [roomId, channelId, initialCacheLoaded]);

  useEffect(() => {
    if (lastMessage !== null && initialCacheLoaded) {
      const messageData = JSON.parse(lastMessage.data);
      const messageExists = messageHistory.some(
        (msg) => JSON.parse(msg.data).mid === messageData.mid
      );

      if (!messageExists) {
        setMessageHistory((prev) => {
          // Add the new message to the array
          const updatedMessages = [...prev, lastMessage];

          // Sort messages by timestamp in the data payload
          return updatedMessages.sort((a, b) => {
            // Parse the data payloads to access the timestamp
            const msgA = JSON.parse(a.data);
            const msgB = JSON.parse(b.data);

            // Compare timestamps - newest messages last (for scrolling to bottom)
            // If timestamps are dates, convert them to comparable values
            const timeA = new Date(msgA.timestamp).getTime();
            const timeB = new Date(msgB.timestamp).getTime();

            return timeA - timeB; // Ascending order (oldest first)
          });
        });
      }
    }
  }, [lastMessage, initialCacheLoaded, messageHistory, roomId]);

  const handleSendMessage = useCallback(() => {
    if (message.trim()) {
      const newMessage = {
        message: message.trim(),
        room_id: roomId,
        channel_id: channelId,
        timestamp: formatDateTime(new Date()),
      };
      sendJsonMessage(newMessage);
      setMessage("");
    } else {
      flagMessageErr(true);
    }
  }, [message, sendJsonMessage, roomId, channelId]);

  return {
    message,
    messageErr,
    messageHistory,
    handleSendMessage,
    setMessage,
    flagMessageErr,
  };
};
