import { fetchToken } from "@/utils/login";
import { Button, Card, CardBody, Divider, Input } from "@nextui-org/react";
import { useState, useEffect, useCallback, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { CardHeader } from "@nextui-org/card";
import { useParams } from "react-router-dom";

// Constants
const token = await fetchToken();

const Socket = () => {
  const { room_id } = useParams();
  const baseUrl = "ws://10.1.1.207:8000/message";
  const didUnmount = useRef(false);
  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState<MessageEvent<string>[]>(
    []
  );
  const [messageErr, flagMessageErr] = useState(false);
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `${baseUrl}/${room_id}?token=${token}`,
    {
      shouldReconnect: () => {
        return didUnmount.current === false;
      },
      reconnectAttempts: 10,
      reconnectInterval: 3000,
    }
  );

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
    return () => {
      didUnmount.current = true;
    };
  }, [lastMessage]);

  const handleSendMessage = useCallback(() => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    } else {
      flagMessageErr(true);
    }
  }, [message, sendMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div className="w-screen h-screen">
      <Card className="flex flex-col items-start">
        <CardHeader>
          Room - <span> The WebSocket is currently {connectionStatus}</span>
        </CardHeader>
        <Divider />
        <CardBody>
          <ul>
            {messageHistory.map((msg) => (
              <li key={JSON.parse(msg.data).mid}>
                <div className="flex flex-col mb-2 ml-2">
                  <span>
                    <text className="font-bold">
                      {JSON.parse(msg.data).username}
                    </text>
                    <text className="pr-1 pl-1">@</text>
                    <text>{JSON.parse(msg.data).time_stamp}</text>
                  </span>
                  <text>{JSON.parse(msg.data).message}</text>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-row">
            <Input
              onChange={(e) => {
                const value = e.target.value;
                setMessage(value);
                if (value.trim()) {
                  flagMessageErr(false);
                } else {
                  flagMessageErr(true);
                }
              }}
              value={message}
              placeholder="Enter your message"
            />
            <Button
              onClick={handleSendMessage}
              disabled={readyState !== ReadyState.OPEN}
            >
              Send
            </Button>
          </div>
          {messageErr && (
            <div style={{ color: "red" }}>Message cannot be empty</div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Socket;
