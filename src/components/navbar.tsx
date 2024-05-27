import { useState, useEffect } from "react";
import { Avatar, AvatarGroup } from "@nextui-org/react";
import { Divider } from "@nextui-org/divider";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/dropdown";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const OnlineDot = () => (
    <div className="w-3 h-3 rounded-full bg-green-500 inline-block mr-2"></div>
  );

  const DndDot = () => (
    <div className="w-3 h-3 rounded-full bg-red-500 inline-block mr-2"></div>
  );

  const IdleDot = () => (
    <div className="w-3 h-3 rounded-full bg-yellow-500 inline-block mr-2"></div>
  );

  const OfflineDot = () => (
    <div className="w-3 h-3 rounded-full bg-gray-500 inline-block mr-2"></div>
  );

  return (
    <>
      <div
        id="drawer-trigger"
        className={`fixed inset-x-0 w-screen bottom-0 h-16 flex justify-center items-center transition-transform duration-500 ${
          isDrawerOpen ? "translate-y-0" : "translate-y-[85%]"
        }`}
      >
        <div className="isolate flex gap-4 p-2 mx-4 w-screen rounded-t-lg backdrop-blur-lg shadow-lg bg-white/30 backdrop-filter backdrop-saturate-200 border border-white/20 frosted-glass">
          <Dropdown className="w-4">
            <DropdownTrigger>
              <Avatar
                className="transition-transform duration-300 hover:-translate-y-2 shadow-lg"
                src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownSection showDivider>
                <DropdownItem
                  onClick={(e) => navigate("/profile")}
                  key="profile"
                >
                  profile
                </DropdownItem>
              </DropdownSection>
              <DropdownItem key="online">
                online <OnlineDot />
              </DropdownItem>
              <DropdownItem key="idle">
                idle <IdleDot />
              </DropdownItem>
              <DropdownItem key="dnd">
                do not disturb <DndDot />
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Divider orientation="vertical" />
          <AvatarGroup isBordered>
            <Avatar
              className="transition-transform duration-300 hover:-translate-y-2 shadow-lg"
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            />
            <Avatar
              className="transition-transform duration-300 hover:-translate-y-2 shadow-lg"
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            />
            <Avatar
              className="transition-transform duration-300 hover:-translate-y-2 shadow-lg"
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            />
          </AvatarGroup>
        </div>
      </div>
    </>
  );
}
