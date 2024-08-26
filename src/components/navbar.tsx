import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { Divider } from "@nextui-org/divider";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/dropdown";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/state/store";
import { useNavbarContext } from "../providers/NavbarContext";
import { clearRoomNotifications } from "@/state/connectionSlice";
import { BsArrowBarRight, BsGear, BsHouseExclamation } from "react-icons/bs";
import { logOff } from "./logOff";

export default function NavBar() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const navigate = useNavigate();
  const { isNavbarOpen } = useNavbarContext();
  const dispatch = useDispatch();

  const notifications = useSelector(
    (state: RootState) => state.webSocket.notifications
  );

  const roomsJoined = useSelector(
    (state: RootState) => state.userState.roomsJoined
  );
  const pinnedFriends = useSelector(
    (state: RootState) => state.userState.pinnedFriends
  );

  const status = useSelector(
    (state: RootState) => state.userState.userState.userStatus
  );

  const pfp = useSelector((state: RootState) => state.userState.userState.pic);
  const handleRoomNavigation = (roomId: string) => {
    dispatch(clearRoomNotifications(roomId));
    navigate(`/room/${roomId}`);
  };

  const _colorMap = {
    online: "bg-green-500",
    dnd: "bg-red-500",
    idle: "bg-yellow-500",
    offline: "bg-gray-500",
  };

  const colorMap = {
    online: "success",
    dnd: "danger",
    idle: "warning",
    offline: "default",
  };

  const StatusDot = ({ status }: { status: keyof typeof _colorMap }) => (
    <div
      className={`w-3 h-3 rounded-sm ${_colorMap[status]} inline-block mr-2`}
    ></div>
  );
  return (
    <div
      id="drawer-trigger"
      className={`fixed inset-x-0 bottom-0 h-20 flex 
      justify-center items-center transition-transform duration-300
      
      ${isNavbarOpen ? "translate-y-0" : "translate-y-[80%]"}
        
        `}
    >
      <div
        id="drawer-trigger"
        className={`isolate 
          flex justify-between 
          items-center gap-6 p-4 mx-4 w-full 
          max-w-4xl rounded-t-sm backdrop-blur-md border border-sepia/30 
          transition-shadow duration-300 hover:shadow-lg shadow-orange-500
          `}
      >
        <Badge
          content="0"
          color={
            colorMap[status] as
              | "success"
              | "danger"
              | "warning"
              | "default"
              | "primary"
              | "secondary"
              | undefined
          }
        >
          <Dropdown
            radius="sm"
            classNames={{
              base: "before:bg-default-200", // change arrow background
              content: "p-0 border-divider bg-background",
            }}
          >
            <DropdownTrigger>
              <Avatar
                className="justify-content transition-transform duration-300 hover:-translate-y-1 hover:scale-105 shadow-lg border-2 border-sepia "
                src={pfp}
              ></Avatar>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="User Actions"
              className="bg-black/90 text-white shadow-lg"
              itemClasses={{
                base: [
                  "rounded-md",
                  "text-sepia",
                  "transition-opacity",
                  "data-[hover=true]:text-foreground",
                  "data-[hover=true]:bg-default-100",
                  "dark:data-[hover=true]:bg-default-50",
                  "data-[selectable=true]:focus:bg-default-50",
                  "data-[pressed=true]:opacity-70",
                  "data-[focus-visible=true]:ring-default-500",
                ],
              }}
            >
              <DropdownSection showDivider>
                <DropdownItem
                  onClick={() => navigate("/profile")}
                  key="profile"
                >
                  Profile
                </DropdownItem>
              </DropdownSection>
              <DropdownSection title="Status" showDivider>
                <DropdownItem key="online">
                  <span className="flex items-center">
                    Online <StatusDot status="online" />
                  </span>
                </DropdownItem>
                <DropdownItem key="idle">
                  <span className="flex items-center">
                    Idle <StatusDot status="idle" />
                  </span>
                </DropdownItem>
                <DropdownItem key="dnd">
                  <span className="flex items-center">
                    Do Not Disturb <StatusDot status="dnd" />
                  </span>
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </Badge>

        <Divider orientation="vertical" className="h-full bg-sepia/30" />
        <div className="">
          <AvatarGroup className="space-x-2">
            {pinnedFriends.map((friend, index) => (
              <Avatar
                key={index} // Use a unique key for each Avatar, index is used here but ideally, you should use a unique id from the friend object if available
                className="transition-transform duration-300 hover:-translate-y-1 hover:scale-105 shadow-lg border-2 border-sepia"
                src={friend.pic} // Assuming `pic` is the image URL of the friend's avatar
                onClick={() => {
                  navigate(`/@/${friend.username}`, {
                    state: { userId: friend.user_id },
                  });
                }}
              />
            ))}
          </AvatarGroup>
        </div>
        <div className="flex flex-row ml-6">
          {roomsJoined.map((room) => {
            const roomNotifications = notifications.filter(
              (n) => n.roomId === room.id
            ).length;
            return (
              <div
                key={room.id as string} // Add type assertion here
                className="flex flex-row items-center gap-2 p-2  bg-black/50 hover:bg-black/70 text-sepia hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => handleRoomNavigation(room.id.toString())}
              >
                <div className="font-semibold">{room.room_name}</div>
                {roomNotifications > 0 && (
                  <div className="text-sm text-red-500">
                    {roomNotifications}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-end ml-6">
          <div className="flex justify-end gap-2 p-2  items-center text-sepia bg-black/50 hover:bg-black/70 transition-all duration-300 cursor-pointer space-x-2">
            <Button
              onClick={() => {
                navigate("/");
              }}
              className="rounded-sm"
              variant="bordered"
            >
              <BsHouseExclamation size={20} />
            </Button>
            <Button
              className="rounded-sm"
              onClick={() => {
                navigate("/settings");
              }}
              variant="bordered"
            >
              <BsGear size={20} />
            </Button>
            <Button onPress={onOpen} className="rounded-sm" variant="bordered">
              Log Out
              <BsArrowBarRight size={20} />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      {
                        // add logo with name
                      }{" "}
                      R3almx{" "}
                    </ModalHeader>
                    <ModalBody>Are you sure you want to Log Out</ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={logOff}>
                        Log Out
                      </Button>
                      <Button color="primary" onPress={onClose}>
                        Close
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
