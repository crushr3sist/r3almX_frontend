import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface NavbarContextProps {
  isNavbarOpen: boolean;
  setIsNavbarOpen: (isOpen: boolean) => void;
}

const NavbarContext = createContext<NavbarContextProps | undefined>(undefined);

export const useNavbarContext = (): NavbarContextProps => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error("useNavbarContext must be used within a NavbarProvider");
  }
  return context;
};

export const NavbarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  useEffect(() => {
    const handleMouseEnter = () => setIsNavbarOpen(true);
    const handleMouseLeave = () => setIsNavbarOpen(false);
    console.log(handleMouseEnter);
    console.log(handleMouseLeave);

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

  return (
    <NavbarContext.Provider value={{ isNavbarOpen, setIsNavbarOpen }}>
      {children}
    </NavbarContext.Provider>
  );
};
