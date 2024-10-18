import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Divider,
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
import { IPinnedFriends, TSstatus } from "@/state/userSliceInterfaces";
import { setStatus } from "@/state/userSlice";
import { fetchToken } from "@/utils/login";
import axios from "axios";
import routes from "@/utils/routes";

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
  ) as IPinnedFriends[] | string[];

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
  const updateStatus = async (newStatus) => {
    const token = await fetchToken();
    return await axios.post(`${routes.statusChange}?new_status=${newStatus}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  const changeStatus = async (newStatus: string) => {
    if (newStatus == status) return;
    else {
      await dispatch(setStatus(newStatus as TSstatus));
      await updateStatus(newStatus);
    }
    return;
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
      fixed inset-x-0 bottom-0 h-20 flex 
      ${isNavbarOpen ? "translate-y-0" : "translate-y-[80%]"}
          p-5

        justify-center items-center transition-transform duration-300
        `}
    >
      <div
        id="drawer-trigger"
        className={`
          isolate 
          flex 
          justify-between 
          relative
          items-center 
          p-5
          gap-6 
          w-full 
          rounded-t-sm 
          backdrop-blur-md 
          border 
          border-[#f4ecd8] 
          transition-shadow 
          duration-300 
          hover:shadow-lg 
          shadow-orange-500
          `}
      >
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
                <Button variant="bordered" className="border-[#f4ecd8] ">
                  Status: <StatusDot status={status} />
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
        <Divider orientation="vertical" className="h-full bg-sepia/30" />
        <div className="">
          <AvatarGroup className="space-x-2">
            {Array.isArray(pinnedFriends) && pinnedFriends.length > 0 ? (
              pinnedFriends.map((friend, index) => (
                <Avatar
                  key={index}
                  className="transition-transform duration-300 hover:-translate-y-1 hover:scale-105 shadow-lg border-2 border-[#f4ecd8] "
                  src={friend.pic}
                  onClick={() => {
                    navigate(`/@/${friend.username}`, {
                      state: { userId: friend.user_id },
                    });
                  }}
                />
              ))
            ) : (
              <div></div> // Optional: Handle empty state
            )}
          </AvatarGroup>
        </div>
        <div className="flex flex-row ml-6 overflow-auto ">
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
              className="rounded-sm border-[#f4ecd8] "
              variant="bordered"
            >
              <BsHouseExclamation size={20} />
            </Button>
            <Button
              className="rounded-sm border-[#f4ecd8] "
              onClick={() => {
                navigate("/settings");
              }}
              variant="bordered"
            >
              <BsGear size={20} />
            </Button>
            <Button
              onPress={onOpen}
              className="rounded-sm border-[#f4ecd8] "
              variant="bordered"
            >
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
