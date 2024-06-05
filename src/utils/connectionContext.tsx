import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface WebSocketContextType {
  socket: WebSocket | null;
  sendMessage: (message: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

export const WebSocketProvider: React.FC<{
  url: string;
  children: React.ReactNode;
}> = ({ url, children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const connect = () => {
    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connection opened.");
      setSocket(ws);
      reconnectAttemptsRef.current = 0;
    };

    ws.onmessage = (message) => {
      console.log("Received message:", message.data);
      // Handle incoming message
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
      setSocket(null);
      handleReconnect();
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      ws.close();
    };
  };

  const handleReconnect = () => {
    const maxReconnectAttempts = 10;
    if (reconnectAttemptsRef.current < maxReconnectAttempts) {
      const reconnectDelay = Math.min(
        1000 * 2 ** reconnectAttemptsRef.current,
        3000
      );
      reconnectAttemptsRef.current += 1;
      setTimeout(() => {
        console.log("attempting to reconnect");
        connect();
      }, reconnectDelay);
    } else {
      console.error("Max reconnect attempts reached. Your fault bre");
    }
  };
  useEffect(() => {
    connect();
    return () => {
      socketRef.current?.close();
    };
  }, [url]);

  const sendMessage = (message: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    } else {
      console.error(
        "WebSocket is not open. Ready state is:",
        socketRef.current?.readyState
      );
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
