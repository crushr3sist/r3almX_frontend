import useWebSocket, { ReadyState } from "react-use-websocket";
import routes from "@/utils/routes";
import { useRef } from "react";
/**
 * The `useWebSocketConnection` function establishes a WebSocket connection for a specific room using a token and provides information about the connection status, ready state, sending JSON messages, and the last received message.
 * @param {string} roomId - The `roomId` parameter is a string that represents the unique identifier of the room for which the WebSocket connection is being established.
 * @returns The `useWebSocketConnection` function returns an object with the following properties:
 * - `connectionStatus`: A string representing the current connection status based on the WebSocket readyState.
 * - `readyState`: The current state of the WebSocket connection.
 * - `sendJsonMessage`: A function to send JSON messages over the WebSocket connection.
 * - `lastMessage`: The last message received over the WebSocket connection.
 */

export const useWebSocketConnection = (roomId: string) => {
  const token = localStorage.getItem("token");
  const didUnmount = useRef(false);

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    `${routes.messageSocket}/${roomId}?token=${token}`,
    {
      shouldReconnect: () => !didUnmount.current,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
    }
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return { connectionStatus, readyState, sendJsonMessage, lastMessage };
};
