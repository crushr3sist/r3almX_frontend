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
import { useEffect, useState } from "react";
import { RootState } from "@/state/store";

export default function NavBar() {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const roomsJoined = useSelector(
    (state: RootState) => state.userState.roomsJoined
  );
  const status = useSelector(
    (state: RootState) => state.userState.userState.userStatus
  );

  useEffect(() => {
    const handleMouseEnter = () => {
      setTimeout(() => {
        setIsDrawerOpen(true);
      }, 5);
    };

    const handleMouseLeave = () => {
      setIsDrawerOpen(false);
    };

    const drawerTrigger = document.getElementById("drawer-trigger");
    if (drawerTrigger) {
      drawerTrigger.addEventListener("mouseenter", handleMouseEnter);
      drawerTrigger.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (drawerTrigger) {
        drawerTrigger.removeEventListener("mouseenter", handleMouseEnter);
        drawerTrigger.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  const _colorMap = {
    online: "bg-green-500",
    dnd: "bg-red-500",
    idle: "bg-yellow-500",
    offline: "bg-gray-500",
  };
  type badge_type =
    | "success"
    | "danger"
    | "warning"
    | "default"
    | "primary"
    | "secondary"
    | undefined;

  const colorMap = {
    online: "success",
    dnd: "danger",
    idle: "warning",
    offline: "default",
  };

  const StatusDot = ({ status }: { status: keyof typeof _colorMap }) => {
    return (
      <div
        className={`w-3 h-3 rounded-full ${_colorMap[status]} inline-block mr-2`}
      ></div>
    );
  };
  console.log("status is ", colorMap[status] as badge_type);

  return (
    <>
      <div
        id="drawer-trigger"
        className={`fixed inset-x-0 bottom-0 h-20 flex justify-center items-center transition-transform duration-300 ${
          isDrawerOpen ? "translate-y-0" : "translate-y-[80%]"
        }`}
      >
        <div className="isolate flex gap-6 p-4 mx-4 w-full max-w-4xl rounded-t-lg backdrop-blur-md bg-white/30 backdrop-filter border border-white/30 shadow-lg">
          {/* Dropdown for Profile and Status */}
          <Dropdown>
            <DropdownTrigger>
              <Badge content="0" color={colorMap[status].toString()}>
                <Avatar
                  className="transition-transform duration-300 hover:-translate-y-1 shadow-lg"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                />
              </Badge>
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions">
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
                  Online <StatusDot status="online" />
                </DropdownItem>
                <DropdownItem key="idle">
                  Idle <StatusDot status="idle" />
                </DropdownItem>
                <DropdownItem key="dnd">
                  Do Not Disturb <StatusDot status="dnd" />
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>

          {/* Divider */}
          <Divider orientation="vertical" className="h-full" />

          {/* Group of Avatars */}
          <AvatarGroup isBordered>
            <Avatar
              className="transition-transform duration-300 hover:-translate-y-1 shadow-lg"
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            />
            <Avatar
              className="transition-transform duration-300 hover:-translate-y-1 shadow-lg"
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            />
            <Avatar
              className="transition-transform duration-300 hover:-translate-y-1 shadow-lg"
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            />
          </AvatarGroup>

          {/* List of Joined Rooms */}
          <div className="flex flex-col ml-6">
            {roomsJoined.map((room) => (
              <div
                key={room.id}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate(`/room/${room.id}`)}
              >
                <div className="font-semibold">{room.room_name}</div>
                {room.notifications > 0 && (
                  <div className="text-sm text-red-500">
                    {room.notifications}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
