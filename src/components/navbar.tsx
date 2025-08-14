import { useUserState } from "@/providers/UserProvider";
import { useNotifications } from "@/providers/NotificationProvider";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Divider,
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
import { useNavbarContext } from "../providers/NavbarContext";
import { IPinnedFriends, TSstatus } from "@/providers/UserProvider";
import { fetchToken } from "@/utils/login";
import axios from "axios";
import routes from "@/utils/routes";
import { useAuth } from "@/utils/AuthContext";
import instance from "@/utils/axios_instance";

export default function NavBar() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isNavbarOpen } = useNavbarContext();
  const navigate = useNavigate();

  const { userState, roomsJoined, pinnedFriends, setStatus } = useUserState();
  const { notifications, clearRoomNotifications } = useNotifications();
  const { userStatus, pic: pfp } = userState;

  const handleRoomNavigation = (roomId: string) => {
    clearRoomNotifications(roomId);
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

  const updateStatus = async (newStatus) => {
    return await instance.post(
      `${routes.statusChange}?new_status=${newStatus}`
    );
  };
  const changeStatus = async (newStatus: string) => {
    if (newStatus == status) return;
    else {
      setStatus(newStatus as TSstatus);
      await updateStatus(newStatus);
    }
    return;
  };

  const StatusDot = ({ status }: { status: keyof typeof _colorMap }) => (
    <div
      className={`w-3 h-3 rounded-sm ${_colorMap[status]} inline-block mr-2`}
    ></div>
  );
  const { logout } = useAuth();
  return (
    <div
      id="drawer-trigger"
      className={`fixed inset-x-0 bottom-0 flex ${
        isNavbarOpen ? "translate-y-0" : "translate-y-[80%]"
      } p-2 justify-center items-center transition-transform duration-300`}
    >
      <div
        id="drawer-trigger"
        className="isolate flex justify-between items-center p-2 gap-2 w-full max-w-7xl rounded-lg border border-[#f4ecd8] transition-shadow duration-300 hover:shadow-lg bg-black/20 backdrop-blur-sm overflow-hidden"
      >
        {/* Left Section - User Profile */}
        <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
          <Avatar src={pfp} className="border-2 border-[#f4ecd8] w-12 h-12" />
          <Badge
            content="0"
            color={
              colorMap[userStatus] as
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
                <Button
                  variant="bordered"
                  className="border-[#f4ecd8] text-sm px-3 py-2"
                  size="md"
                >
                  <span className="hidden sm:inline">Status:</span>
                  <StatusDot status={userStatus} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownSection title="Status">
                  <DropdownItem
                    key="online"
                    onClick={() => {
                      changeStatus("online");
                    }}
                  >
                    <span className="flex items-center">
                      Online <StatusDot status="online" />
                    </span>
                  </DropdownItem>
                  <DropdownItem
                    key="idle"
                    onClick={() => {
                      changeStatus("idle");
                    }}
                  >
                    <span className="flex items-center">
                      Idle <StatusDot status="idle" />
                    </span>
                  </DropdownItem>
                  <DropdownItem
                    key="dnd"
                    onClick={() => {
                      changeStatus("dnd");
                    }}
                  >
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

        <Divider
          orientation="vertical"
          className="h-10 bg-sepia/30 flex-shrink-0"
        />

        {/* Pinned Friends Section */}
        <div className="flex-shrink-0 min-w-0">
          <AvatarGroup className="gap-2">
            {Array.isArray(pinnedFriends) && pinnedFriends.length > 0 ? (
              pinnedFriends.slice(0, 3).map((friend, index) => (
                <Avatar
                  key={index}
                  className="transition-transform duration-300 hover:-translate-y-1 hover:scale-105 shadow-lg border-2 border-[#f4ecd8] w-10 h-10"
                  src={friend.pic}
                  onClick={() => {
                    navigate(`/@/${friend.username}`, {
                      state: { userId: friend.user_id },
                    });
                  }}
                />
              ))
            ) : (
              <div className="w-10"></div>
            )}
          </AvatarGroup>
        </div>

        <Divider
          orientation="vertical"
          className="h-10 bg-sepia/30 flex-shrink-0"
        />

        {/* Rooms Section - Centered and Scrollable */}
        <div className="flex-1 min-w-0 px-2 flex justify-center">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide max-w-full">
            {roomsJoined.map((room) => {
              const roomNotifications = notifications.filter(
                (n) => n.roomId === room.id
              ).length;
              return (
                <div
                  key={room.id as string}
                  className="flex items-center gap-2 px-3 py-2 bg-black/50 hover:bg-black/70 text-sepia hover:shadow-lg transition-all duration-300 cursor-pointer whitespace-nowrap flex-shrink-0 rounded text-sm"
                  onClick={() => handleRoomNavigation(room.id.toString())}
                >
                  <div className="font-semibold truncate max-w-32">
                    {room.room_name}
                  </div>
                  {roomNotifications > 0 && (
                    <div className="text-xs text-red-500 bg-red-500/20 px-2 py-1 rounded">
                      {roomNotifications}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Divider
          orientation="vertical"
          className="h-10 bg-sepia/30 flex-shrink-0"
        />

        {/* Right Section - Navigation Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex gap-2 p-2 items-center text-sepia bg-black/50 hover:bg-black/70 transition-all duration-300 rounded">
            <Button
              onClick={() => {
                navigate("/");
              }}
              className="rounded-sm border-[#f4ecd8] w-10 h-10"
              variant="bordered"
              size="md"
              isIconOnly
            >
              <BsHouseExclamation size={18} />
            </Button>
            <Button
              className="rounded-sm border-[#f4ecd8] w-10 h-10"
              onClick={() => {
                navigate("/settings");
              }}
              variant="bordered"
              size="md"
              isIconOnly
            >
              <BsGear size={18} />
            </Button>
            <Button
              onPress={onOpen}
              className="rounded-sm border-[#f4ecd8] px-3 py-2"
              variant="bordered"
              size="md"
            >
              <span className="hidden md:inline">Log Out</span>
              <BsArrowBarRight size={18} />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      R3alm
                    </ModalHeader>
                    <ModalBody>Are you sure you want to Log Out</ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={logout}>
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
