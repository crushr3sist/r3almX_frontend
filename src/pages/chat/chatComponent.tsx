import {
  Card,
  CardHeader,
  Divider,
  CardBody,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  Input,
} from "@nextui-org/react";
import EmojiPicker from "emoji-picker-react";
import {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
} from "react";
import { BsPaperclip, BsEmojiSmile, BsChevronRight } from "react-icons/bs";
import { ReadyState } from "react-use-websocket";

interface ICHatProps {
  isNavbarOpen: any;
  isSidebarOpen: any;
  connectionStatus: any;
  roomName: any;
  scrollRef: any;
  messageHistory: any;
  setMessage: any;
  flagMessageErr: any;
  message: any;
  handleSendMessage: any;
  readyState: any;
  messageErr: any;
  setIsSidebarOpen: any;
  channels: any;
  handleClick: any;
}

const ChatComponent = ({
  isNavbarOpen,
  isSidebarOpen,
  connectionStatus,
  roomName,
  scrollRef,
  messageHistory,
  setMessage,
  flagMessageErr,
  message,
  handleSendMessage,
  readyState,
  messageErr,
  setIsSidebarOpen,
  channels,
  handleClick,
}: ICHatProps) => {
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
              {messageHistory.map((msg: { data: string }) => {
                const messageData = JSON.parse(msg.data);

                return (
                  <li
                    key={messageData.id}
                    className="flex flex-col w-full space-y-1 animate-slideIn"
                    onContextMenu={() => {
                      console.log("right clicked", messageData.id);
                      return (
                        <Popover placement="right">
                          <PopoverTrigger>
                            <Button>Open Popover</Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="px-1 py-2">
                              <div className="text-small font-bold">
                                Popover Content
                              </div>
                              <div className="text-tiny">
                                This is the popover content
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      );
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sepia">
                        {messageData.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {messageData.timestamp}
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
                color="secondary"
                className="p-2 bg-sepia text-black rounded-lg hover:bg-sepia/80 transition-all duration-200"
              >
                <BsPaperclip size={20} />
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
            {channels &&
              channels.map(
                (channel: {
                  id: Key | null | undefined;
                  channel_name:
                    | string
                    | number
                    | boolean
                    | ReactElement<any, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | null
                    | undefined;
                  channel_description:
                    | string
                    | number
                    | boolean
                    | ReactElement<any, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | null
                    | undefined;
                }) => (
                  <li
                    key={channel.id}
                    className="flex items-center p-2 rounded bg-black/80 hover:bg-black/70 transition-colors duration-200 cursor-pointer"
                    onClick={() => handleClick(channel.id)}
                  >
                    <div className="w-full">
                      <div className="font-semibold text-sm">
                        {channel.channel_name}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {channel.channel_description}
                      </div>
                    </div>
                  </li>
                )
              )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
