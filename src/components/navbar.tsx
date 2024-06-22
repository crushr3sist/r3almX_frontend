import { useSelector } from "react-redux";
import { Avatar, AvatarGroup, Badge } from "@nextui-org/react";
import { Divider } from "@nextui-org/divider";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/dropdown";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/state/store";
import { useNavbarContext } from "../providers/NavbarContext";

export default function NavBar() {
  const navigate = useNavigate();
  const { isNavbarOpen } = useNavbarContext();

  const roomsJoined = useSelector(
    (state: RootState) => state.userState.roomsJoined
  );
  const status = useSelector(
    (state: RootState) => state.userState.userState.userStatus
  );

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
      className={`fixed inset-x-0 bottom-0 h-20 flex justify-center items-center transition-transform duration-300 ${
        isNavbarOpen ? "translate-y-0" : "translate-y-[80%]"
      }`}
    >
      <div
        id="drawer-trigger"
        className="isolate flex gap-6 p-4 mx-4 w-full max-w-4xl rounded-t-lg backdrop-blur-md bg-black/70 border border-sepia/30 shadow-lg"
      >
        <Dropdown>
          <DropdownTrigger>
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
              <Avatar
                className="transition-transform duration-300 hover:-translate-y-1 hover:scale-105 shadow-lg border-2 border-sepia"
                src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
              />
            </Badge>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="User Actions"
            className="bg-black/80 text-sepia shadow-lg"
          >
            <DropdownSection showDivider>
              <DropdownItem onClick={() => navigate("/profile")} key="profile">
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

        <Divider orientation="vertical" className="h-full bg-sepia/30" />

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

        <div className="flex flex-col ml-6">
          {roomsJoined.map((room) => (
            <div
              key={room.id}
              className="flex items-center gap-2 p-2 rounded-md bg-black/50 hover:bg-black/70 text-sepia hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/room/${room.id}`)}
            >
              <div className="font-semibold">{room.room_name}</div>
              {room.notifications > 0 && (
                <div className="text-sm text-red-500">{room.notifications}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
