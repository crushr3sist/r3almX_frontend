import routes from "@/utils/routes";
import {
  Card,
  CardHeader,
  Divider,
  CardBody,
  Button,
  Input,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import {
  Modal,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@nextui-org/react";

import axios from "axios";

import { BsPaperclip, BsPlusCircleDotted } from "react-icons/bs";

import { ReadyState } from "react-use-websocket";
import { IChannels } from "./hooks/useChannelManagement";
import instance from "@/utils/axios_instance";

interface ICHatProps {
  message: string;
  roomName: string;
  roomId: string;
  channelId: string;
  channels: IChannels[];
  channelName: string;
  channelDesc: string;
  scrollRef: React.MutableRefObject<HTMLUListElement>;
  readyState: ReadyState;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  messageErr: boolean;
  handleClick: (
    newChannelId: string,
    channelName: string,
    channelDesc: string
  ) => void;
  isNavbarOpen: boolean;
  messageHistory: MessageEvent<string>[];
  flagMessageErr: React.Dispatch<React.SetStateAction<boolean>>;
  connectionStatus: string;
  handleSendMessage: () => void;
  setNewChannelName: React.Dispatch<React.SetStateAction<string>>;
  setNewChannelDescription: React.Dispatch<React.SetStateAction<string>>;
  newChannelName: string;
  newChannelDescription: string;
  createNewChannel: (
    channel_description: string,
    channel_name: string,
    room_id: string
  ) => Promise<{ [key: string]: string }>;
  updateRoom: () => Promise<void>;
}

const ChatComponent = ({
  message,
  roomName,
  roomId,
  channelId,
  channels,
  channelName,
  channelDesc,
  scrollRef,
  readyState,
  setMessage,
  messageErr,
  handleClick,
  isNavbarOpen,
  messageHistory,
  flagMessageErr,
  connectionStatus,
  handleSendMessage,
  setNewChannelName,
  setNewChannelDescription,
  newChannelName,
  newChannelDescription,
  createNewChannel,
  updateRoom,
}: ICHatProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleCreateChannel = (e) => {
    e.preventDefault();
    createNewChannel(newChannelName, newChannelDescription, roomId);
    setNewChannelName("");
    setNewChannelDescription("");
  };

  const deleteChannel = async (channelId, roomId) => {
    await instance.delete(
      `${routes.channelDelete}?channel_id=${channelId}&room_id=${roomId}`
    );
    updateRoom();
  };

  return (
    <div
      className={`w-screen h-screen transition-padding duration-300 ${
        isNavbarOpen ? "pb-20" : ""
      } flex flex-col bg-black text-sepia relative`}
    >
      <div className="flex w-full h-full p-5 gap-5">
        <Card
          className={`flex flex-col h-full w-2/3
           rounded-lg shadow-lg bg-black/90 border
          border-[#f4ecd8]  text-sepia backdrop-blur-md transition-width duration-300`}
        >
          <CardHeader className="flex items-center justify-between px-4 py-2 bg-black/80 rounded-t-lg">
            <span className="text-lg font-semibold">
              Room - {roomName}
              <div className="flex flex-col">
                <p className="gap-2">{channelName}</p>
                <p className="gap-2">{channelDesc}</p>
              </div>
            </span>
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
            {channels && !channelId ? (
              <>
                {/* channel selector */}
                {channels.map((channel) => (
                  <li
                    key={channel.id}
                    className="flex items-center p-2 rounded bg-black/80 hover:bg-black/70 transition-colors duration-200 cursor-pointer"
                    onClick={() => {
                      handleClick(
                        channel.id,
                        channel.channel_description,
                        channel.channel_name
                      );
                    }}
                  >
                    <div className="w-full">
                      <div className="font-semibold text-sm">
                        {channel.channel_name}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {channel.channel_description}
                      </div>
                    </div>
                    <Dropdown placement="bottom-end">
                      <DropdownTrigger>
                        <Button isIconOnly>:</Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        disallowEmptySelection
                        aria-label="Merge options"
                        className="max-w-[300px]"
                      >
                        <DropdownItem key="edit" description={""}>
                          edit
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          onPress={() => deleteChannel(channel.id, roomId)}
                        >
                          delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </li>
                ))}
              </>
            ) : (
              <>
                {/* chat interface */}
                <ul
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto space-y-4 pr-4 scrollbar-thin scrollbar-thumb-sepia scrollbar-track-black/50"
                >
                  {messageHistory.map((msg) => {
                    const messageData = JSON.parse(msg.data);
                    return (
                      <li
                        key={messageData.id || messageData.mid}
                        className="flex flex-col w-full space-y-1 animate-slideIn"
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
                    <Input type="file" className="absolute opacity-0" />
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                    placeholder="Enter your message"
                    className="flex-1 bg-black/70 text-sepia placeholder-gray-500 border
          border-[#f4ecd8]  focus:ring-0 rounded-lg"
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
              </>
            )}
          </CardBody>
        </Card>
        {/* sidebar */}
        <div
          className="border 
          border-[#f4ecd8] focus:ring-0 rounded-lg top-0 right-0 h-full w-1/3 bg-black/90 text-sepia shadow-lg rounded-l-lg transition-transform duration-300"
        >
          <div className="p-4">
            <Input
              placeholder="Search members"
              className="w-full bg-black/70 text-sepia placeholder-gray-500 border
          border-[#f4ecd8]  focus:ring-0 rounded-lg"
            />
            <Button
              onPress={onOpen}
              className="w-full bg-black/70 text-sepia placeholder-gray-500 border
          border-[#f4ecd8]  focus:ring-0 rounded-lg"
            >
              Add Channel <BsPlusCircleDotted size={20} />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                {(_onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Modal Title
                    </ModalHeader>
                    <ModalBody>
                      <div className="pb-1">
                        <h1>Add channel</h1>
                        <form onSubmit={handleCreateChannel}>
                          <Input
                            placeholder="Channel Name"
                            onChange={(e) => setNewChannelName(e.target.value)}
                            required
                          ></Input>
                          <Input
                            placeholder="Channel Description"
                            onChange={(e) =>
                              setNewChannelDescription(e.target.value)
                            }
                            required
                          ></Input>
                          <Button onPress={_onClose} type="submit">
                            create
                          </Button>
                        </form>
                      </div>
                    </ModalBody>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
          {/* channels render */}
          <ul className="flex-1 overflow-y-auto space-y-2 p-4 pr-2 scrollbar-thin scrollbar-thumb-sepia scrollbar-track-black/50">
            {channels &&
              channels.map((channel) => (
                <li
                  key={channel.id}
                  className="flex items-center p-2 rounded bg-black/80 hover:bg-black/70 transition-colors duration-200 cursor-pointer"
                  onClick={() => {
                    handleClick(
                      channel.id,
                      channel.channel_description,
                      channel.channel_name
                    );
                  }}
                >
                  <div className="w-full">
                    <div className="font-semibold text-sm">
                      {channel.channel_name}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {channel.channel_description}
                    </div>
                  </div>
                  <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                      <Button isIconOnly>:</Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      disallowEmptySelection
                      aria-label="Merge options"
                      className="max-w-[300px]"
                    >
                      <DropdownItem key="edit" description={""}>
                        edit
                      </DropdownItem>
                      <DropdownItem
                        key="delete"
                        onPress={() => deleteChannel(channel.id, roomId)}
                      >
                        delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
