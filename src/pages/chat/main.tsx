/* eslint-disable @typescript-eslint/no-unused-vars */
//* eslint-disable @typescript-eslint/no-unused-vars */
import { fetchToken } from "@/utils/login";
import { Button, Card, CardBody, Divider, Input } from "@nextui-org/react";
import { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { CardHeader } from "@nextui-org/card";

// Constants
const token = await fetchToken();

const room_id = "245ec7c9-30a5-4e68-bdd4-36652b8c4037";
const baseUrl = "ws://10.1.1.207:8000/message";
// need to fetch room ids

// Components
const Socket = () => {
  const [message, setMessage] = useState("");
  const [socketUrl] = useState(`${baseUrl}/${room_id}?token=${token}`);
  const [messageHistory, setMessageHistory] = useState<MessageEvent<string>[]>(
    []
  );
  const [messageErr, flagMessageErr] = useState(false);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage]);

  const handleClickSendMessage = useCallback(
    () => sendMessage(message),
    [message]
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div className="flex flex-col items-start w-1/2 h-1/2">
      <Card>
        <CardHeader>
          Room-
          <ConnectionStatus connectionStatus={connectionStatus} />
        </CardHeader>
        <Divider />

        <CardBody>
          <MessageHistory messageHistory={messageHistory} />
          <div className="flex flex-row">
            <MessageInput message={message} setMessage={setMessage} />
            <SendMessageButton
              handleClickSendMessage={handleClickSendMessage}
              readyState={readyState}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

const MessageInput = ({
  message,
  setMessage,
}: {
  message: string;
  setMessage: (value: string) => void;
}) => (
  <Input
    onChange={(text) => {
      if (text.target.value !== null || text.target.value === "") {
        setMessage(text.target.value);
      } else {
        flagMessageErr(true);
      }
    }}
    value={message}
  />
);

const SendMessageButton = ({
  handleClickSendMessage,
  readyState,
}: {
  handleClickSendMessage: () => void;
  readyState: ReadyState;
}) => (
  <Button
    onClick={handleClickSendMessage}
    disabled={readyState !== ReadyState.OPEN}
  >
    send
  </Button>
);

const ConnectionStatus = ({
  connectionStatus,
}: {
  connectionStatus: string;
}) => <span>The WebSocket is currently {connectionStatus}</span>;

const MessageHistory = ({
  messageHistory,
}: {
  messageHistory: MessageEvent[];
}) => (
  <ul>
    {messageHistory.map((message, idx) => (
      <li key={idx}>{message?.data || null}</li>
    ))}
  </ul>
);
export default Socket;
