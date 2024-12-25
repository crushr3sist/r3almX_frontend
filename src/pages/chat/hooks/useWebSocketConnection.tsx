import useWebSocket, { ReadyState } from "react-use-websocket";
import routes from "@/utils/routes";
import { useRef } from "react";

export const useWebSocketConnection = (roomId: string) => {
  const token = localStorage.getItem("token");
  const didUnmount = useRef(false);

  const { sendJsonMessage, readyState } = useWebSocket(
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

  return { connectionStatus, readyState, sendJsonMessage };
};
