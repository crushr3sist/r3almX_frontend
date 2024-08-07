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
      className={`w-3 h-3 rounded-full ${_colorMap[status]} inline-block mr-2`}
    ></div>
  );

  return (
    <div
      id="drawer-trigger"
      className={`fixed inset-x-0 bottom-0 h-20 flex justify-center items-center transition-transform duration-300
        
        ${isNavbarOpen ? "translate-y-0" : "translate-y-[80%]"}
        `}
    >
      <div
        id="drawer-trigger"
        className={`isolate 
          flex justify-between 
          items-center gap-6 p-4 mx-4 w-full 
          max-w-4xl rounded-t-lg backdrop-blur-md border border-sepia/30 
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
          <Dropdown>
            <DropdownTrigger>
              <Avatar
                className="justify-content transition-transform duration-300 hover:-translate-y-1 hover:scale-105 shadow-lg border-2 border-sepia "
                src={pfp}
              ></Avatar>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="User Actions"
              className="bg-black/80 text-sepia shadow-lg"
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
            <Avatar
              className="transition-transform duration-300 hover:-translate-y-1 hover:scale-105 shadow-lg border-2 border-sepia"
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            />
            <Avatar
              className="transition-transform duration-300 hover:-translate-y-1 hover:scale-105 shadow-lg border-2 border-sepia"
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            />
            <Avatar
              className="transition-transform duration-300 hover:-translate-y-1 hover:scale-105 shadow-lg border-2 border-sepia"
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            />
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
                className="flex flex-row items-center gap-2 p-2 rounded-md bg-black/50 hover:bg-black/70 text-sepia hover:shadow-lg transition-all duration-300 cursor-pointer"
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
          <div className="flex justify-end gap-2 p-2 rounded-md items-center text-sepia bg-black/50 hover:bg-black/70 transition-all duration-300 cursor-pointer space-x-2">
            <Button
              onClick={() => {
                navigate("/");
              }}
              variant="bordered"
            >
              <BsHouseExclamation size={20} />
            </Button>
            <Button
              onClick={() => {
                navigate("/settings");
              }}
              variant="bordered"
            >
              <BsGear size={20} />
            </Button>
            <Button onPress={onOpen} onClick={() => {}} variant="bordered">
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
