import { useState, useEffect, useRef, useCallback } from "react";
import { fetchToken } from "@/utils/login";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Divider,
  Input,
} from "@nextui-org/react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { CardHeader } from "@nextui-org/card";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { decrementRoomNotification } from "@/state/userSlice";
import { useNavbarContext } from "@/providers/NavbarContext";
import { BsEmojiSmile, BsPaperclip, BsChevronRight } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";

const token = await fetchToken();

const mockMembers = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
  { id: 4, name: "Diana" },
  { id: 5, name: "Eve" },
];

const Socket = () => {
  const { room_id } = useParams();
  const baseUrl = "ws://10.1.1.207:8000/message";
  const didUnmount = useRef(false);
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const [messageHistory, setMessageHistory] = useState<MessageEvent<string>[]>(
    []
  );
  const roomsJoined = useSelector(
    (state: RootState) => state.userState.roomsJoined
  );
  const roomName = roomsJoined.find((room) => room.id === room_id)?.room_name;
  const [messageErr, flagMessageErr] = useState(false);
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `${baseUrl}/${room_id}?token=${token}`,
    {
      shouldReconnect: () => !didUnmount.current,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
    }
  );

  const { isNavbarOpen } = useNavbarContext();

  const scrollRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
      dispatch(decrementRoomNotification(room_id));
    }
  }, [dispatch, lastMessage, room_id]);

  useEffect(() => {
    if (room_id) {
      dispatch(decrementRoomNotification(room_id));
    }
  }, [dispatch, room_id]);

  useEffect(() => {
    // Scroll to the bottom when messageHistory changes
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messageHistory]);

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
    <div
      className={`w-screen h-screen transition-padding duration-300 ${
        isNavbarOpen ? "pb-28" : "pb-20"
      } flex flex-col bg-black text-sepia relative`}
    >
      <div className="flex w-full h-full p-5">
        <Card
          className={`flex flex-col h-full ${
            isSidebarOpen ? "w-3/4" : "w-full"
          } rounded-lg shadow-lg bg-black/90 border border-sepia text-sepia backdrop-blur-md transition-width duration-300`}
        >
          <CardHeader className="flex items-center justify-between px-4 py-2 bg-black/80 rounded-t-lg">
            <span className="text-lg font-semibold">Room - {roomName}</span>
            <span
              className={`text-sm ${
                connectionStatus === "Open" ? "text-green-500" : "text-red-500"
              }`}
            >
              {connectionStatus}
            </span>
          </CardHeader>
          <Divider />
          <CardBody className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
            <ul
              ref={scrollRef}
              className="flex-1 overflow-y-auto space-y-4 pr-4 scrollbar-thin scrollbar-thumb-sepia scrollbar-track-black/50"
            >
              {messageHistory.map((msg) => {
                const messageData = JSON.parse(msg.data);
                return (
                  <li
                    key={messageData.mid}
                    className="flex flex-col space-y-1 animate-slideIn"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sepia">
                        {messageData.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {messageData.time_stamp}
                      </span>
                    </div>
                    <div className="text-sm text-gray-300">
                      {messageData.message}
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="flex items-center mt-4 space-x-2">
              <Button
                icon={<BsPaperclip size={20} />}
                color="secondary"
                auto
                className="p-2 bg-sepia text-black rounded-lg hover:bg-sepia/80 transition-all duration-200"
              >
                <input type="file" className="absolute opacity-0" />
              </Button>
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
                className="flex-1 bg-black/70 text-sepia placeholder-gray-500 border-sepia focus:border-sepia focus:ring-0 rounded-lg"
                endContent={
                  <BsEmojiSmile
                    size={20}
                    onClick={() => <EmojiPicker open={true} />}
                    className="cursor-pointer text-sepia hover:text-sepia/80 transition-colors duration-200"
                  />
                }
              />
              <Button
                onClick={handleSendMessage}
                disabled={readyState !== ReadyState.OPEN}
                className="px-4 py-2 bg-sepia text-black rounded-lg hover:bg-sepia/80 transition-all duration-200"
              >
                Send
              </Button>
            </div>
            {messageErr && (
              <div className="mt-2 text-sm text-red-600">
                Message cannot be empty
              </div>
            )}
          </CardBody>
        </Card>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`absolute right-0 top-0 mt-20 p-2 bg-sepia rounded-l-lg text-black hover:bg-sepia/80 transition-all duration-300 ${
            isSidebarOpen ? "mr-64" : ""
          }`}
        >
          <BsChevronRight
            size={24}
            className={`${isSidebarOpen ? "" : "rotate-180"}`}
          />
        </button>
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-black/90 text-sepia shadow-lg rounded-l-lg transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4">
            <Input
              placeholder="Search members"
              className="w-full bg-black/70 text-sepia placeholder-gray-500 border-sepia focus:border-sepia focus:ring-0 rounded-lg"
            />
          </div>
          <ul className="flex-1 overflow-y-auto space-y-2 p-4 pr-2 scrollbar-thin scrollbar-thumb-sepia scrollbar-track-black/50">
            {mockMembers.map((member) => (
              <li
                key={member.id}
                className="flex items-center p-2 rounded bg-black/80 hover:bg-black/70 transition-colors duration-200"
              >
                <Avatar
                  src={`https://i.pravatar.cc/50?u=${member.id}`}
                  className="mr-2"
                />
                <span className="text-sm font-semibold">{member.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Socket;
