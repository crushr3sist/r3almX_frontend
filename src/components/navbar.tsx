import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
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
import { BsArrowBarRight, BsGear, BsHouseExclamation } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/state/store";
import { useNavbarContext } from "../providers/NavbarContext";
import { clearRoomNotifications } from "@/state/connectionSlice";
import { logOff } from "./logOff";

export default function NavBar() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isNavbarOpen } = useNavbarContext();
  const navigate = useNavigate();
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
      className={`
      fixed 
      inset-x-0 
      bottom-0 
      h-20 
      flex 
      border 
      border-[#f4ecd8] 
      p-5
      ${isNavbarOpen ? "translate-y-0" : "translate-y-[80%]"} 
      justify-center 
      items-center 
      transition-transform 
      duration-300
      `}
    >
      <div className="flex items-center justify-between w-full p-2 bg-black/80 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <Avatar src={pfp} className="border-2 border-[#f4ecd8]" />
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
            <Dropdown radius="sm">
              <DropdownTrigger>
                <Button>
                  Status: <StatusDot status={status} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownSection title="Status">
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
                <DropdownSection title="User">
                  <DropdownItem
                    key="profile"
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          </Badge>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="bordered" onClick={() => navigate("/settings")}>
            <BsGear size={20} />
          </Button>
          <Button
            variant="bordered"
            onClick={onOpen}
          >
            <BsArrowBarRight size={20} />
          </Button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    R3almx
                  </ModalHeader>
                  <ModalBody>Are you sure you want to Log Out?</ModalBody>
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
      {/* Main Section */}
      <div className="flex items-center justify-between w-full p-2 overflow-x-auto bg-black/60 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <AvatarGroup size="md">
            {pinnedFriends.length ? (
              pinnedFriends.map((friend, index) => (
                <Avatar
                  key={index}
                  src={friend.pic}
                  className="cursor-pointer hover:-translate-y-1 transition-transform duration-300"
                  onClick={() =>
                    navigate(`/@/${friend.username}`, {
                      state: { userId: friend.user_id },
                    })
                  }
                />
              ))
            ) : (
              <Spinner />
            )}
          </AvatarGroup>
        </div>

        <div className="flex flex-wrap space-x-4 ml-6">
          {roomsJoined.map((room) => {
            const roomNotifications = notifications.filter(
              (n) => n.roomId === room.id
            ).length;
            return (
              <Button
                key={room.id}
                variant="flat"
                className="transition-transform duration-300"
                onClick={() => handleRoomNavigation(room.id)}
              >
                {room.room_name}
                {roomNotifications > 0 && (
                  <Badge
                    color="danger"
                    content={roomNotifications}
                    className="ml-2"
                  >
                    <span>{roomNotifications}</span>
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>
      {/* Bottom Section */}
      <div className="flex justify-end w-full p-2 bg-black/70 backdrop-blur-md">
        <Button variant="bordered" onClick={() => navigate("/")}>
          <BsHouseExclamation size={20} />
        </Button>
      </div>
    </div>
  );
}
